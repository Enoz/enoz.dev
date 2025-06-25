locals {
  s3_origin_id = "enozian-origin-id"
}

## Certificate

resource "aws_acm_certificate" "enozian" {
  domain_name       = "www.enozian.com"
  region            = "us-east-1"
  validation_method = "DNS"
}

resource "cloudflare_dns_record" "cert-verification" {
  for_each = {
    for dvo in aws_acm_certificate.enozian.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  zone_id = var.cloudflare_zone_id
  name    = each.value.name
  type    = each.value.type
  content = each.value.record
  comment = "TF: AWS Cert Verification"
  proxied = false
  ttl     = 60
}

resource "aws_acm_certificate_validation" "enozian" {
  region          = "us-east-1"
  certificate_arn = aws_acm_certificate.enozian.arn
}

resource "aws_cloudfront_origin_access_control" "enozian" {
  name                              = "enozian-origin-access"
  description                       = "Cloudfront Origin Access"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.enozian.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.enozian.id
    origin_id                = local.s3_origin_id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = ["www.enozian.com"]


  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.enozian.arn
    ssl_support_method  = "sni-only"
  }

  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }


    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"
}


resource "cloudflare_dns_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  type    = "CNAME"
  content = aws_cloudfront_distribution.s3_distribution.domain_name
  comment = "TF: AWS Cloudfront Record"
  proxied = false
  ttl     = 1
}



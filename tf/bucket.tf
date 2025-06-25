resource "aws_s3_bucket" "enozian" {
  bucket        = "enozian.com"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.enozian.id

  block_public_acls   = false
  block_public_policy = false
}

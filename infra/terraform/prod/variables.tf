variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "smart-campus"
}

variable "environment" {
  default = "prod"
}

variable "key_name" {
  default = "smart-campus-prod-key"
}

variable "my_ip" {
  description = "Your public IP with /32"
  type        = string
}
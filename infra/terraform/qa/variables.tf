variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "smart-campus"
}

variable "environment" {
  default = "qa"
}

variable "key_name" {
  default = "smart-campus-qa-key"
}

variable "my_ip" {
  description = "Your public IP with /32"
  type        = string
}
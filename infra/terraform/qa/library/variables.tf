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
  default = "smart-campus-key"
}

variable "developer_ssh_cidr" {
  description = "Temporary SSH access. Replace 0.0.0.0/0 with your public IP /32 when possible."
  default     = "0.0.0.0/0"
}
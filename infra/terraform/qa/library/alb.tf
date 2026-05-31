resource "aws_lb" "library" {
  name               = "smart-campus-qa-library-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]

  tags = {
    Name = "${var.project_name}-${var.environment}-library-alb"
  }
}

resource "aws_lb_target_group" "library" {
  name        = "smart-campus-qa-library-tg"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = aws_vpc.qa.id
  target_type = "instance"

  health_check {
    enabled             = true
    path                = "/health"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-library-tg"
  }
}

resource "aws_lb_target_group_attachment" "library" {
  target_group_arn = aws_lb_target_group.library.arn
  target_id        = aws_instance.library_service.id
  port             = 3001
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.library.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.library.arn
  }
}
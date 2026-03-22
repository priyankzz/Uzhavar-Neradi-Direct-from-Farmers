# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.core.mail import send_mail
# from .models import User

# @receiver(post_save, sender=User)
# def send_approval_email(sender, instance, created, **kwargs):
#     if not created and instance.is_approved and not kwargs.get('raw', False):
#         # User just got approved
#         subject = "Your Uzhavar Neradi Account is Approved!"
#         message = f"Hello {instance.username},\n\nYour account has been approved by the admin. You can now log in."
#         send_mail(subject, message, 'noreply@uzhavar.com', [instance.email])
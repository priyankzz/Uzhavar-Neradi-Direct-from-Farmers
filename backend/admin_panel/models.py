"""
Admin Panel Models.
Copy to: backend/admin_panel/models.py
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator

User = get_user_model()

class PlatformSettings(models.Model):
    """Platform-wide settings"""
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False, help_text="Visible to all users")
    
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='settings_updated')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Platform Settings"
    
    def __str__(self):
        return self.key

class PlatformLogo(models.Model):
    """Platform logo management"""
    logo = models.ImageField(
        upload_to='logos/',
        validators=[FileExtensionValidator(['png', 'jpg', 'jpeg', 'svg'])]
    )
    favicon = models.ImageField(
        upload_to='logos/',
        blank=True, null=True,
        validators=[FileExtensionValidator(['png', 'ico'])]
    )
    is_active = models.BooleanField(default=True)
    
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        get_latest_by = 'uploaded_at'
    
    def __str__(self):
        return f"Logo uploaded on {self.uploaded_at}"

class MiddlemanFlag(models.Model):
    """Flags for potential middleman violations"""
    FLAG_TYPES = [
        ('BULK_PURCHASE', 'Bulk Purchase'),
        ('RESELLER_PATTERN', 'Reseller Pattern'),
        ('MULTIPLE_ACCOUNTS', 'Multiple Accounts'),
        ('UNUSUAL_ORDERING', 'Unusual Ordering Pattern'),
        ('PRICE_GOUGING', 'Price Gouging'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('INVESTIGATING', 'Under Investigation'),
        ('CONFIRMED', 'Confirmed Violation'),
        ('FALSE_ALARM', 'False Alarm'),
        ('RESOLVED', 'Resolved'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='middleman_flags')
    flag_type = models.CharField(max_length=50, choices=FLAG_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Evidence
    description = models.TextField()
    evidence_data = models.JSONField(default=dict, help_text="Structured evidence data")
    supporting_docs = models.FileField(upload_to='middleman_evidence/', blank=True, null=True)
    
    # Orders involved (if applicable)
    related_orders = models.ManyToManyField('orders.Order', blank=True)
    
    # Resolution
    investigated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='investigated_flags')
    investigated_at = models.DateTimeField(blank=True, null=True)
    resolution_notes = models.TextField(blank=True)
    action_taken = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['user', 'flag_type']),
        ]
    
    def __str__(self):
        return f"{self.get_flag_type_display()} - {self.user.email}"

class Dispute(models.Model):
    """Customer/Farmer dispute management"""
    DISPUTE_TYPES = [
        ('ORDER_ISSUE', 'Order Issue'),
        ('PAYMENT_ISSUE', 'Payment Issue'),
        ('DELIVERY_ISSUE', 'Delivery Issue'),
        ('PRODUCT_QUALITY', 'Product Quality'),
        ('REFUND', 'Refund Request'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
        ('ESCALATED', 'Escalated'),
    ]
    
    dispute_id = models.CharField(max_length=20, unique=True, editable=False)
    dispute_type = models.CharField(max_length=50, choices=DISPUTE_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    
    # Parties involved
    raised_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disputes_raised')
    against_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disputes_against', null=True, blank=True)
    order = models.ForeignKey('orders.Order', on_delete=models.SET_NULL, null=True, blank=True, related_name='disputes')
    
    # Details
    title = models.CharField(max_length=200)
    description = models.TextField()
    attachments = models.JSONField(default=list, help_text="List of attachment URLs")
    
    # Resolution
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_disputes')
    resolution = models.TextField(blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='resolved_disputes')
    resolved_at = models.DateTimeField(blank=True, null=True)
    
    # Timeline
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.dispute_id:
            # Generate unique dispute ID
            import uuid
            self.dispute_id = f"DSP-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.dispute_id} - {self.title}"

class DisputeMessage(models.Model):
    """Messages within a dispute"""
    dispute = models.ForeignKey(Dispute, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    attachments = models.JSONField(default=list)
    is_staff_only = models.BooleanField(default=False, help_text="Visible only to staff")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message by {self.sender.username} on {self.created_at}"

class AuditLog(models.Model):
    """Audit log for admin actions"""
    ACTION_TYPES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('VERIFY', 'Verify'),
        ('REJECT', 'Reject'),
        ('BAN', 'Ban'),
        ('UNBAN', 'Unban'),
        ('OTHER', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    
    # What was affected
    content_type = models.CharField(max_length=100, help_text="Model name")
    object_id = models.CharField(max_length=100, blank=True)
    object_repr = models.CharField(max_length=200, blank=True)
    
    # Details
    changes = models.JSONField(default=dict, help_text="Changes made")
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['action_type', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.action_type} by {self.user} at {self.timestamp}"

class Announcement(models.Model):
    """Platform announcements"""
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    title = models.CharField(max_length=200)
    title_ta = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    content_ta = models.TextField(blank=True)
    
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    # Targeting
    target_roles = models.JSONField(default=list, help_text="['FARMER', 'CUSTOMER', 'DELIVERY']")
    is_public = models.BooleanField(default=True)
    
    # Scheduling
    publish_from = models.DateTimeField()
    publish_until = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-publish_from', '-priority']
    
    def __str__(self):
        return self.title
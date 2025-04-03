from django.db import models
from django.contrib.auth.models import Group
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(
        max_length=50,
        choices=[
            ('client', 'Клиент'),
            ('service_company', 'Сервисная организация'),
            ('manager', 'Менеджер'),
        ],
    )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Получаем или создаем группу на основе роли
        group, _ = Group.objects.get_or_create(name=self.role.capitalize())

        # Очищаем все группы пользователя
        self.user.groups.clear()

        # Добавляем пользователя в новую группу
        self.user.groups.add(group)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()


class MachineModel(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        return self.name

class EngineModel(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        return self.name

class TransmissionModel(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        return self.name

class DriveAxleModel(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        return self.name

class ControlledAxleModel(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        return self.name

class MaintenanceType(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        return self.name

class FailureNode(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        return self.name

class RecoveryMethod(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        return self.name

class Machine(models.Model):
    head_machine_No = models.CharField(max_length=255, unique=True)
    model = models.ForeignKey(MachineModel, on_delete=models.CASCADE)
    model_engine = models.ForeignKey(EngineModel, on_delete=models.CASCADE)
    engine_No = models.CharField(max_length=255)
    model_transmission = models.ForeignKey(TransmissionModel, on_delete=models.CASCADE)
    transmission_No = models.CharField(max_length=255)
    driving_axle = models.ForeignKey(DriveAxleModel, on_delete=models.CASCADE)
    axle_No = models.CharField(max_length=255)
    model_controlled_axle = models.ForeignKey(ControlledAxleModel, on_delete=models.CASCADE)
    controlled_axle_No = models.CharField(max_length=255)
    delivery_agreement_date = models.TextField()
    date_shipment = models.DateField()
    recipient = models.CharField(max_length=255)
    delivery_address = models.CharField(max_length=255)
    equipment = models.TextField()
    client = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='machines_as_client'
    )
    service_company = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='machines_as_service_company'
    )

    def __str__(self):
        return self.head_machine_No

    class Meta:
        ordering = ['date_shipment']

class TechnicalService(models.Model):
    type = models.ForeignKey(MaintenanceType, on_delete=models.CASCADE)
    date = models.DateField()
    operating_time = models.IntegerField()
    order_number = models.CharField(max_length=255)
    date_order = models.DateField()
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    service_company = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return self.order_number

class Claim(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, verbose_name='Машина', related_name='claims')
    failure_date = models.DateField()
    operating_time = models.PositiveIntegerField()
    failure_node = models.ForeignKey(FailureNode, on_delete=models.SET_NULL, null=True, blank=True,)
    failure_description = models.TextField()
    recovery_method = models.ForeignKey(RecoveryMethod, on_delete=models.SET_NULL, null=True, blank=True,)
    spare_parts_used = models.TextField(blank=True, null=True)
    recovery_date = models.DateField(null=True, blank=True)
    downtime = models.PositiveIntegerField(editable=False,null=True, blank=True)
    service_company = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-failure_date']

    def __str__(self):
        return self.failure_description

    def save(self, *args, **kwargs):
        if self.failure_date and self.recovery_date:
            delta_days = (self.recovery_date - self.failure_date).days
            self.downtime = delta_days * 24
        else:
            self.downtime = None

        super().save(*args, **kwargs)





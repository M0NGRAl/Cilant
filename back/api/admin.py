from django.contrib import admin
from .models import (
    UserProfile,
    MachineModel,
    EngineModel,
    TransmissionModel,
    DriveAxleModel,
    ControlledAxleModel,
    MaintenanceType,
    FailureNode,
    RecoveryMethod,
    Machine,
    TechnicalService,
    Claim
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)
    search_fields = ('user__username',)

@admin.register(MachineModel)
class MachineModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(EngineModel)
class EngineModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(TransmissionModel)
class TransmissionModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(DriveAxleModel)
class DriveAxleModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(ControlledAxleModel)
class ControlledAxleModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(MaintenanceType)
class MaintenanceTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(FailureNode)
class FailureNodeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(RecoveryMethod)
class RecoveryMethodAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = (
        'head_machine_No',
        'model',
        'date_shipment',
        'recipient',
        'client',
        'service_company'
    )
    list_filter = ('model', 'client', 'service_company')
    search_fields = ('head_machine_No', 'recipient')

@admin.register(TechnicalService)
class TechnicalServiceAdmin(admin.ModelAdmin):
    list_display = (
        'type',
        'date',
        'operating_time',
        'order_number',
        'machine',
        'service_company'
    )
    list_filter = ('type', 'service_company')
    search_fields = ('order_number', 'machine__head_machine_No')

@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = (
        'machine',
        'failure_date',
        'operating_time',
        'failure_node',
        'recovery_date',
        'downtime'
    )
    list_filter = ('failure_node', 'recovery_method', 'machine')
    search_fields = ('machine__head_machine_No',)
    readonly_fields = ('downtime',)
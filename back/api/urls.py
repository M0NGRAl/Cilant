from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MachineModelViewSet, EngineModelViewSet, TransmissionModelViewSet,
    DriveAxleModelViewSet, ControlledAxleModelViewSet, MaintenanceTypeViewSet,
    FailureNodeViewSet, RecoveryMethodViewSet, MachineViewSet, ClaimViewSet,
    TechnicalServiceViewSet, UserProfileViewSet, custom_login, check_auth, custom_logout, custom_refresh
)

router = DefaultRouter()
router.register(r'users', UserProfileViewSet)
router.register(r'machine-models', MachineModelViewSet)
router.register(r'engine-models', EngineModelViewSet)
router.register(r'transmission-models', TransmissionModelViewSet)
router.register(r'drive-axle-models', DriveAxleModelViewSet)
router.register(r'controlled-axle-models', ControlledAxleModelViewSet)
router.register(r'maintenance-types', MaintenanceTypeViewSet)
router.register(r'failure-nodes', FailureNodeViewSet)
router.register(r'recovery-methods', RecoveryMethodViewSet)
router.register(r'machines', MachineViewSet, basename='machine')
router.register(r'claims', ClaimViewSet)
router.register(r'technical-services', TechnicalServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', custom_login, name='login'),
    path('check-auth/', check_auth, name='check_auth'),
    path('logout/', custom_logout, name='logout'),
    path('refresh/', custom_refresh, name='token_refresh'),
]
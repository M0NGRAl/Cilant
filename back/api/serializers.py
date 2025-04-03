from rest_framework import serializers
from .models import (MachineModel, EngineModel, TransmissionModel,
                     TechnicalService, MaintenanceType, DriveAxleModel,
                     ControlledAxleModel, Machine, FailureNode, RecoveryMethod, Claim, UserProfile)

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.StringRelatedField(source='user.username')

    class Meta:
        model = UserProfile
        fields = '__all__'



class MachineModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineModel
        fields = '__all__'

class EngineModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngineModel
        fields = '__all__'

class TransmissionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransmissionModel
        fields = '__all__'

class DriveAxleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveAxleModel
        fields = '__all__'

class ControlledAxleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlledAxleModel
        fields = '__all__'

class MaintenanceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceType
        fields = '__all__'

class FailureNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FailureNode
        fields = '__all__'

class RecoveryMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryMethod
        fields = '__all__'

class MachineSerializer(serializers.ModelSerializer):
    model = serializers.SerializerMethodField()
    model_engine = serializers.SerializerMethodField()
    model_transmission = serializers.SerializerMethodField()
    driving_axle = serializers.SerializerMethodField()
    model_controlled_axle = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    service_company = serializers.SerializerMethodField()
    model_id = serializers.PrimaryKeyRelatedField(
        queryset=MachineModel.objects.all(), source='model', write_only=True
    )
    model_engine_id = serializers.PrimaryKeyRelatedField(
        queryset=EngineModel.objects.all(), source='model_engine', write_only=True
    )
    model_transmission_id = serializers.PrimaryKeyRelatedField(
        queryset=TransmissionModel.objects.all(), source='model_transmission', write_only=True
    )
    driving_axle_id = serializers.PrimaryKeyRelatedField(
        queryset=DriveAxleModel.objects.all(), source='driving_axle', write_only=True
    )
    model_controlled_axle_id = serializers.PrimaryKeyRelatedField(
        queryset=ControlledAxleModel.objects.all(), source='model_controlled_axle', write_only=True
    )
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(), source='client', write_only=True
    )
    service_company_id = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(), source='service_company', write_only=True
    )

    class Meta:
        model = Machine
        fields = '__all__'

    def get_model(self, obj):
        return MachineModelSerializer(obj.model).data

    def get_model_engine(self, obj):
        return EngineModelSerializer(obj.model_engine).data

    def get_model_transmission(self, obj):
        return TransmissionModelSerializer(obj.model_transmission).data

    def get_driving_axle(self, obj):
        return DriveAxleModelSerializer(obj.driving_axle).data

    def get_model_controlled_axle(self, obj):
        return ControlledAxleModelSerializer(obj.model_controlled_axle).data

    def get_client(self, obj):
        return UserProfileSerializer(obj.client).data

    def get_service_company(self, obj):
        return UserProfileSerializer(obj.service_company).data

class ClaimSerializer(serializers.ModelSerializer):
    machine = serializers.SerializerMethodField()
    failure_node = serializers.SerializerMethodField()
    recovery_method = serializers.SerializerMethodField()
    service_company = serializers.SerializerMethodField()

    machine_id = serializers.PrimaryKeyRelatedField(
        queryset=Machine.objects.all(), source='machine', write_only=True
    )
    failure_node_id = serializers.PrimaryKeyRelatedField(
        queryset=FailureNode.objects.all(), source='failure_node', write_only=True, allow_null=True
    )
    recovery_method_id = serializers.PrimaryKeyRelatedField(
        queryset=RecoveryMethod.objects.all(), source='recovery_method', write_only=True, allow_null=True
    )

    service_company_id = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(), source='service_company', write_only=True
    )

    class Meta:
        model = Claim
        fields = '__all__'

    def get_machine(self, obj):
        return MachineSerializer(obj.machine).data

    def get_failure_node(self, obj):
        if obj.failure_node:
            return FailureNodeSerializer(obj.failure_node).data
        return None

    def get_recovery_method(self, obj):
        if obj.recovery_method:
            return RecoveryMethodSerializer(obj.recovery_method).data
        return None

    def get_service_company(self, obj):
        if obj.service_company:
            return UserProfileSerializer(obj.service_company).data
        return None


class TechnicalServiceSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    machine = serializers.SerializerMethodField()
    service_company = serializers.SerializerMethodField()

    type_id = serializers.PrimaryKeyRelatedField(
        queryset=MaintenanceType.objects.all(), source='type', write_only=True
    )
    machine_id = serializers.PrimaryKeyRelatedField(
        queryset=Machine.objects.all(), source='machine', write_only=True
    )
    service_company_id = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(), source='service_company', write_only=True
    )

    class Meta:
        model = TechnicalService
        fields = "__all__"

    def get_type(self, obj):
        return MaintenanceTypeSerializer(obj.type).data

    def get_machine(self, obj):
        return MachineSerializer(obj.machine).data

    def get_service_company(self, obj):
        return UserProfileSerializer(obj.service_company).data


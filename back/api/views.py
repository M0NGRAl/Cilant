from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
import json
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth import authenticate
from .models import (MachineModel, EngineModel, TransmissionModel,
                     TechnicalService, MaintenanceType,DriveAxleModel,
                     ControlledAxleModel, Machine, FailureNode, RecoveryMethod, Claim, UserProfile)
from .serializers import (MachineModelSerializer, EngineModelSerializer, TransmissionModelSerializer,
                          MachineSerializer, DriveAxleModelSerializer, ClaimSerializer, ControlledAxleModelSerializer,
                          FailureNodeSerializer, TechnicalServiceSerializer, MaintenanceTypeSerializer,
                          RecoveryMethodSerializer, UserProfileSerializer)

ROLE_TRANSLATIONS = {
    'client': 'Клиент',
    'service_company': 'Сервисная организация',
    'manager': 'Менеджер'
}


@api_view(['GET'])
def check_auth(request):
    if request.user.is_authenticated:
        try:
            profile = request.user.profile
            role = ROLE_TRANSLATIONS.get(profile.role, 'Клиент')
        except UserProfile.DoesNotExist:
            role = 'Клиент'

        return JsonResponse({
            'status': 'success',
            'is_authenticated': True,
            'username': request.user.username,
            'role': role,
        })
    return JsonResponse({
        'status': 'error',
        'is_authenticated': False,
        'username': None,
        'role': None,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(username=username, password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user)

                try:
                    profile = user.profile
                    role = ROLE_TRANSLATIONS.get(profile.role, 'Клиент')
                except UserProfile.DoesNotExist:
                    role = 'Клиент'

                return JsonResponse({
                    'status': 'success',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'username': user.username,
                    'role': role,
                })
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid credentials'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method is allowed'
    }, status=405)

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_refresh(request):
    try:
        refresh_token = request.data.get['refresh']
        if not refresh_token:
            return Response(
                {"status": "error", "message": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        token = RefreshToken(refresh_token)
        new_access_token = str(token.access_token)

        return Response({
            'status': 'success',
            'access': new_access_token,
            'refresh': str(token),
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def custom_logout(request):
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"status": "error", "message": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {"status": "success", "message": "Successfully logged out"},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'])
    def get_by_name(self, request):
        name = request.data['name']

        if not name:
            return Response(
                {"error": "head_machine_No is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = UserProfile.objects.get(user__username=name)
            serializer = UserProfileSerializer(user)
            return Response(
                serializer.data, status=status.HTTP_200_OK
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "UserProfile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def get_by_role(self, request):
        role = request.data['role']

        if not role:
            return Response(
                {"error": "Role name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = UserProfile.objects.filter(role=role)
            serializer = UserProfileSerializer(user, many=True)
            return Response(
                serializer.data, status=status.HTTP_200_OK
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "UserProfile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class MachineModelViewSet(viewsets.ModelViewSet):
    queryset = MachineModel.objects.all()
    serializer_class = MachineModelSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class EngineModelViewSet(viewsets.ModelViewSet):
    queryset = EngineModel.objects.all()
    serializer_class = EngineModelSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class TransmissionModelViewSet(viewsets.ModelViewSet):
    queryset = TransmissionModel.objects.all()
    serializer_class = TransmissionModelSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class DriveAxleModelViewSet(viewsets.ModelViewSet):
    queryset = DriveAxleModel.objects.all()
    serializer_class = DriveAxleModelSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class ControlledAxleModelViewSet(viewsets.ModelViewSet):
    queryset = ControlledAxleModel.objects.all()
    serializer_class = ControlledAxleModelSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class MaintenanceTypeViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceType.objects.all()
    serializer_class = MaintenanceTypeSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class FailureNodeViewSet(viewsets.ModelViewSet):
    queryset = FailureNode.objects.all()
    serializer_class = FailureNodeSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecoveryMethodViewSet(viewsets.ModelViewSet):
    queryset = RecoveryMethod.objects.all()
    serializer_class = RecoveryMethodSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

    def create(self, request, *args, **kwargs):
        return Response(
            {"error": "Creating machines is not allowed via API. Use the admin panel."},
            status=status.HTTP_403_FORBIDDEN
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def get_by_head_machine_no(self, request):
        head_machine_No = request.data.get('head_machine_No')

        if not head_machine_No:
            return Response(
                {"error": "head_machine_No is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            machine = Machine.objects.get(head_machine_No=head_machine_No)
            serializer = MachineSerializer(machine)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Machine.DoesNotExist:
            return Response(
                {"error": "Machine not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    @action(detail=False, methods=['post'])
    def get_by_client(self, request):
        username = request.data.get("username")

        if not username:
            return Response(
                {"error": "username is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_profile = UserProfile.objects.get(user__username=username)
            machines = Machine.objects.filter(client=user_profile)

            if not machines.exists():
                return Response(
                    {"error": "No machines found for this client"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = MachineSerializer(machines, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except UserProfile.DoesNotExist:
            return Response(
                {"error": f"User with username '{username}' not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def get_by_service_company(self, request):
        service_company = request.data.get("username")

        if not service_company:
            return Response(
                {"error": "service_company is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if isinstance(service_company, str) and service_company.isdigit():
                machines = Machine.objects.filter(service_company=int(service_company))
            elif isinstance(service_company, int):
                machines = Machine.objects.filter(service_company=service_company)
            else:
                user_profile = UserProfile.objects.get(user__username=service_company)
                machines = Machine.objects.filter(service_company=user_profile)

            if not machines.exists():
                return Response(
                    {"error": "No machines found for this service"},
                    status=status.HTTP_404_NOT_FOUND
                )
            serializer = MachineSerializer(machines, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def get_by_id(self, request):
        id = request.data.get("id")

        if not id:
            return Response(
                {"error": "id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            machine = Machine.objects.get(id=id)
            serializer = MachineSerializer(machine)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Machine.DoesNotExist:
            return Response(
                {"error": "Machine not found"},
                status=status.HTTP_404_NOT_FOUND
        )

class ClaimViewSet(viewsets.ModelViewSet):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'])
    def get_by_head_machine_no(self, request):
        head_machine_No = request.data.get('head_machine_No')

        if not head_machine_No:
            return Response(
                {"error": "head_machine_No is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            machine = Machine.objects.get(head_machine_No=head_machine_No)

            claims = Claim.objects.filter(machine=machine)

            if not claims.exists():
                return Response(
                    {"error": "No claims found for this machine"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = ClaimSerializer(claims, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Machine.DoesNotExist:
            return Response(
                {"error": "Machine not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def get_by_service_company(self, request):
        service_company = request.data.get("username")

        if not service_company:
            return Response(
                {"error": "service_company is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if isinstance(service_company, str) and service_company.isdigit():
                claims = Claim.objects.filter(service_company_id=int(service_company))
            elif isinstance(service_company, int):
                claims = Claim.objects.filter(service_company_id=service_company)
            else:
                user_profile = UserProfile.objects.get(user__username=service_company)
                claims = Claim.objects.filter(service_company=user_profile)

            if not claims.exists():
                return Response(
                    {"error": "No claims found for this service company"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = ClaimSerializer(claims, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Service company not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def get_by_id(self, request):
        id = request.data.get("id")

        if not id:
            return Response(
                {"error": "id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            claim = Claim.objects.get(id=id)
            serializer = ClaimSerializer(claim)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Claim.DoesNotExist:
            return Response(
                {"error": "Claim not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class TechnicalServiceViewSet(viewsets.ModelViewSet):
    queryset = TechnicalService.objects.all()
    serializer_class = TechnicalServiceSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'])
    def get_by_head_machine_no(self, request):
        head_machine_No = request.data.get('head_machine_No')

        if not head_machine_No:
            return Response(
                {"error": "head_machine_No is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            machine = Machine.objects.get(head_machine_No=head_machine_No)

            technical_services = TechnicalService.objects.filter(machine=machine)

            if not technical_services.exists():
                return Response(
                    {"error": "No technical services found for this machine"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = TechnicalServiceSerializer(technical_services, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Machine.DoesNotExist:
            return Response(
                {"error": "Machine not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def get_by_service_company(self, request):
        service_company = request.data.get("username")

        if not service_company:
            return Response(
                {"error": "service_company is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if isinstance(service_company, str) and service_company.isdigit():
                technical_services = TechnicalService.objects.filter(service_company_id=int(service_company))
            elif isinstance(service_company, int):
                technical_services = TechnicalService.objects.filter(service_company_id=service_company)
            else:
                user_profile = UserProfile.objects.get(user__username=service_company)
                technical_services = TechnicalService.objects.filter(service_company=user_profile)

            if not technical_services.exists():
                return Response(
                    {"error": "No technical services found for this service company"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = TechnicalServiceSerializer(technical_services, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Service company not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def get_by_id(self, request):
        id = request.data.get("id")

        if not id:
            return Response(
                {"error": "id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            technical_services = TechnicalService.objects.get(id=id)
            serializer = TechnicalServiceSerializer(technical_services)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except TechnicalService.DoesNotExist:
            return Response(
                {"error": "Technical Services not found"},
                status=status.HTTP_404_NOT_FOUND
            )


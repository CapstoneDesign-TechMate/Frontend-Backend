from .models import User, Recipt
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    def create(self,validated_data):
        user = User.objects.createUser(
                email = validated_data['email'],
                username = validated_data['username'],
                password = validated_data['password'],
        )
        user.save()
        return user
    class Meta:
        model = User
        fields = '__all__'

class ReceiptSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        print("va : ",validated_data)
        receipt = Recipt.objects.createReceipt(validated_data)
        receipt.save()
        return receipt

    class Meta:
        model = Recipt
        fields = '__all__'

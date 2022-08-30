from rest_framework import serializers
from .models import Task

# THIS CONVERTS TASKS OBJECTS INTO JSON OBJECTS
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
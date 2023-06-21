from django.db import models
from django.contrib.auth.models import User

class tcplbook(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    # user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='username', default=None)
    

    def __str__(self):
        return self.name

class India(models.Model):
   
    OBJECTID = models.IntegerField(primary_key=True)
    NAME_1 = models.CharField(max_length=100)
    # Add more fields as per your table structure

    class Meta:
        managed = False
        db_table = 'India'

 
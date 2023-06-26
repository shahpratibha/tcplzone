from django.db import models
from django.contrib.auth.models import User


class BookMarks(models.Model):

    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
  # def __str__(self):
    #     return self.name
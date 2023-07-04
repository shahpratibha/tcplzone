from django.db import models
from django.contrib.auth.models import User


# class BookMarks(models.Model):

#     user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     latitude = models.FloatField()
#     longitude = models.FloatField()
#     def __str__(self):
#         return self.name
    
    
    # Location table create for save bookmark
class Location(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1) 
    name = models.CharField(max_length=100, default='Default Name')
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name
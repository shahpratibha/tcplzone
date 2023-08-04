from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db import models

    #add phone_number in django User table
# class Profile(models.Model):
#     user = models.OneToOneField(User ,on_delete=models.CASCADE)
#     mobile = models.CharField(max_length=20)
#     otp = models.CharField(max_length=6)   
   
   
     # Location table create for save bookmark
class Location(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1) 
    name = models.CharField(max_length=100, default='Default Name')
    latitude = models.FloatField()
    longitude = models.FloatField()

    # def __str__(self):
    #     return self.name
    
class elements(models.Model):
    # geom = models.TextField(blank=True, null=True)  # This field type is a guess.
    geom = models.GeometryField()  # This field type is a guess.
    objectid = models.BigIntegerField(db_column='OBJECTID', blank=True, null=True)  # Field name made lowercase.
    taluka = models.CharField(db_column='Taluka', max_length=50, blank=True, null=True)  # Field name made lowercase.
    area_in_ha = models.FloatField(db_column='Area_In_Ha', blank=True, null=True)  # Field name made lowercase.
    village_name_census = models.CharField(db_column='Village_Name_Census', max_length=255, blank=True, null=True)  # Field name made lowercase.
    village_name_revenue = models.CharField(db_column='Village_Name_Revenue', max_length=255, blank=True, null=True)  # Field name made lowercase.
    temp = models.IntegerField(db_column='Temp', blank=True, null=True)  # Field name made lowercase.
    shape_length = models.FloatField(db_column='Shape_Length', blank=True, null=True)  # Field name made lowercase.
    shape_area = models.FloatField(db_column='Shape_Area', blank=True, null=True)  # Field name made lowercase.
  

    class Meta:
        managed = False
        db_table = ' VILLAGE_BOUNDARY'
        
class Revenue1(models.Model):
    objectid = models.BigIntegerField(db_column='OBJECTID', primary_key=True)  # Field name made lowercase.
    geom = models.GeometryField(blank=True, null=True)
    gut_number = models.CharField(db_column='Gut_Number', max_length=50, blank=True, null=True)  # Field name made lowercase.
    taluka = models.CharField(db_column='Taluka', max_length=50, blank=True, null=True)  # Field name made lowercase.
    area_in_ha = models.FloatField(db_column='Area_In_Ha', blank=True, null=True)  # Field name made lowercase.
    source = models.CharField(db_column='Source', max_length=200, blank=True, null=True)  # Field name made lowercase.
    govtland_gayran_type = models.CharField(db_column='GovtLand_Gayran_Type', max_length=50, blank=True, null=True)  # Field name made lowercase.
    govt_private_forest_type = models.CharField(db_column='Govt_Private_Forest_Type', max_length=50, blank=True, null=True)  # Field name made lowercase.
    govtland_forest_7_12_availibility = models.CharField(db_column='GovtLand_Forest_7_12_Availibility', max_length=50, blank=True, null=True)  # Field name made lowercase.
    govtland_forest_as_7_12_full_part = models.CharField(db_column='GovtLand_Forest_as_7_12_Full_Part', max_length=50, blank=True, null=True)  # Field name made lowercase.
    old_gut_no = models.CharField(db_column='Old_Gut_No', max_length=50, blank=True, null=True)  # Field name made lowercase.
    new_gut_no = models.CharField(db_column='New_Gut_No', max_length=50, blank=True, null=True)  # Field name made lowercase.
    remark = models.CharField(db_column='Remark', max_length=100, blank=True, null=True)  # Field name made lowercase.
    village_name_census = models.CharField(db_column='Village_Name_Census', max_length=255, blank=True, null=True)  # Field name made lowercase.
    village_name_revenue = models.CharField(db_column='Village_Name_Revenue', max_length=255, blank=True, null=True)  # Field name made lowercase.
    temp = models.IntegerField(db_column='Temp', blank=True, null=True)  # Field name made lowercase.
    shape_length = models.FloatField(db_column='Shape_Length', blank=True, null=True)  # Field name made lowercase.
    shape_area = models.FloatField(db_column='Shape_Area', blank=True, null=True)  # Field name made lowercase.
    village_taluka = models.CharField(db_column='Village_Taluka', max_length=5000, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'revenue1'
        
        

class FinalPlu(models.Model):
    fid = models.BigIntegerField(primary_key=True)
    geom = models.GeometryField(blank=True, null=True)
    taluka = models.CharField(db_column='TALUKA', max_length=50, blank=True, null=True)  # Field name made lowercase.
    broad_lu = models.CharField(db_column='Broad_LU', max_length=50, blank=True, null=True)  # Field name made lowercase.
    detailed_l = models.CharField(db_column='Detailed_L', max_length=50, blank=True, null=True)  # Field name made lowercase.
    descriptio = models.CharField(db_column='Descriptio', max_length=150, blank=True, null=True)  # Field name made lowercase.
    label = models.CharField(db_column='Label', max_length=50, blank=True, null=True)  # Field name made lowercase.
    area_ha = models.FloatField(db_column='Area_HA', blank=True, null=True)  # Field name made lowercase.
    plu_zone = models.CharField(db_column='PLU_Zone', max_length=100, blank=True, null=True)  # Field name made lowercase.
    reservatio = models.CharField(db_column='Reservatio', max_length=50, blank=True, null=True)  # Field name made lowercase.
    pa_name = models.CharField(db_column='PA_Name', max_length=50, blank=True, null=True)  # Field name made lowercase.
    growth_centre = models.CharField(db_column='Growth_Centre', max_length=100, blank=True, null=True)  # Field name made lowercase.
    shape_length = models.FloatField(db_column='Shape_Length', blank=True, null=True)  # Field name made lowercase.
    shape_area = models.FloatField(db_column='Shape_Area', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Final_PLU'


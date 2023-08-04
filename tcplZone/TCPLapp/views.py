
from django.shortcuts import render,HttpResponse,redirect, get_object_or_404 
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.template.loader import get_template
from .models import Location, elements, Revenue1,FinalPlu
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import LineString
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.serializers.geojson import Serializer as GeoJSONSerializer
from django.contrib.gis.db.models import Q
import json
import geopandas as gpd
from pyproj import CRS
import requests
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
import io


#main ______________________________________________________________________
@login_required(login_url='login')
# def main(request):

   
#     # user = request.user
  
#     # if request.method == 'POST':
       
#         # name = request.POST.get('name')
#         # latitude = request.POST.get('lat')
#         # longitude = request.POST.get('lng')
#         # new_bookmark = BookMarks.objects.create(name=name, latitude=latitude, longitude=longitude)
#         # new_bookmark.save()
#         return redirect('main')
#     # return render(request, "TCPLapp/main.html", {'bookmarks': bookmarks_from_database})


def main(request):
    return render(request,"TCPLapp/main.html") 




# registration______________________________________________________________________
def registration(request):
    
    if request.method=='POST':
        uname=request.POST.get('username')
        email=request.POST.get('email')
        pass1=request.POST.get('password1')
        pass2=request.POST.get('password2')
        
        if pass1!=pass2:
            return render(request, 'TCPLapp/registration.html', {'error': 'Invalid login credentials'})
        else:
            my_user=User.objects.create_user(uname,email,pass1)
            my_user.save()
        return redirect('login')
    return render(request,"TCPLapp/registration.html")


# login______________________________________________________________________
def loginPage(request):
    if request.method=='POST':
        username=request.POST.get('username')
        pass1=request.POST.get('pass')
        user=authenticate(request,username=username,password=pass1)
        if user is not None:
            login(request,user)
            return redirect('index')
        else:
            # Handle invalid login credentials
            return render(request, 'TCPLapp/login.html', {'error': 'Invalid login credentials'})
        
    return render(request,"TCPLapp/login.html")


#logout ______________________________________________________________________
def LogoutPage(request):
    logout(request)
    return redirect('login')


# index__________________________________________________

@login_required(login_url='login')
def index(request):
  

    return render(request, "TCPLapp/index.html")

# search_button________________________________

def autocomplete(request):
    term = request.GET.get('term')
    if term is not None:
        products = elements.objects.filter(village_name_revenue__istartswith=term).values_list('village_name_revenue','taluka')
        products_list1 = list(set(products))
        products_list = [','.join(t) for t in products_list1]
        
        
    return JsonResponse(products_list, safe=False)


def convert_To_Geojson(products1):
    for instance in  products1:
        coordinates_list = []
        geom_geojson = GEOSGeometry(json.dumps({"type": "MultiPolygon", "coordinates": [instance.geom.coords[0]]}))
        feature = {
        "type": "Feature",
        "geometry": json.loads(geom_geojson.geojson),
        "properties": {
            "village_name_revenue": instance.village_name_revenue,
            "taluka": instance.taluka,
                        } }
        coordinates_list.append(feature)
        geojson_data = {
                    "type": "FeatureCollection",
                    "features": coordinates_list
                            }
  
    return geojson_data

def searchOnClick(request):
    response = request.GET.get("selected_value").split(",")
    villageName, talukaName, gutNumber = response[0],response[1],response[2:]
    products1 = Revenue1.objects.filter(taluka=talukaName,  village_name_revenue=villageName, gut_number= str(gutNumber[0]))
    geojson_gut = convert_To_Geojson(products1)
    
    intersection_query = Q(geom__intersects=products1[0].geom)
    for product in products1[1:]:
        intersection_query |= Q(geom__intersects=product.geom)
    plu = FinalPlu.objects.filter(intersection_query)
    for Iplu in plu:
        intersection_area = Iplu.geom.intersection(products1[0].geom).area
    # You can adjust the calculation based on your use case and data model
        # print(f"PLU ID: {Iplu.broad_lu}, Iplu.shape_area : {Iplu.shape_area},Intersection Area: {intersection_area}")
       
    # #  layer intersection of plu and gut number
    # intersected_geometries = []
    # for Irevenue in products1:
    #     for Iplu in plu:
    #         intersection = Irevenue.geom.intersection(Iplu.geom)
    #         if intersection:
    #             intersected_geometries.append(intersection)
    #         else:
    # print(intersected_geometries,"_______________________________________")
    # for d in intersected_geometries:
    #     print(d,"{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}")
    
    # intersection_json = convert_To_Geojson(intersected_geometries)
    # print(intersection_json)
   
    return JsonResponse(geojson_gut, safe=False)

def Out_table(request):
    response = request.GET.get("selected_value").split(",")
    villageName, talukaName, gutNumber = response[0], response[1], response[2:]
    products1 = Revenue1.objects.filter(taluka=talukaName, village_name_revenue=villageName, gut_number=str(gutNumber[0]))
    intersection_query = Q(geom__intersects=products1[0].geom)

    for product in products1[1:]:
        intersection_query |= Q(geom__intersects=product.geom)
    plu = FinalPlu.objects.filter(intersection_query)
    data = []
    for Iplu in plu:
        intersection_area = Iplu.geom.intersection(products1[0].geom).area
      
        data.append(Iplu.broad_lu)
        data.append(intersection_area)
        
    data1 = {
        "Village_Name": villageName,
        "Taluka_Name": talukaName,
        "Gut_Number": gutNumber,
        "selected_values": data
    }
    return JsonResponse(data1, safe=False)
     
# Save BookMarks_____________________________

@csrf_exempt
@login_required
def save_location(request):
    if request.method == 'POST':
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        name = request.POST.get('name')
        username = request.POST.get('username')

        location = Location(user=request.user, name=name,
                            latitude=latitude, longitude=longitude)
        location.save()

        return JsonResponse({'message': 'Location saved successfully.'})
    else:
        return JsonResponse({'message': 'Invalid request method.'})


def get_locations(request):
    locations = Location.objects.filter(user=request.user)
    data = {
        'locations': list(locations.values('id','name', 'latitude', 'longitude'))
    }
    return JsonResponse(data)

#delete_location
@csrf_exempt
@login_required
def delete_location(request):
    if request.method == 'POST':
        location_id = request.POST.get('locationId')
        try:
            location = Location.objects.get(id=location_id)
            if location.user == request.user:
                location.delete()
                return JsonResponse({'message': 'Location deleted successfully.'})
            else:
                return JsonResponse({'message': 'Unauthorized access.'}, status=401)
        except Location.DoesNotExist:
            return JsonResponse({'message': 'Location not found.'}, status=404)
    else:
        return JsonResponse({'message': 'Invalid request method.'}, status=400)
  
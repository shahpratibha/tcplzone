from django.shortcuts import render,HttpResponse,redirect, get_object_or_404 
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
import csv
from .models import Location
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
import requests



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
        # return HttpResponse('user has been created successfully!!!!!!')
        return redirect('login')
        # print(uname,email,pass1,pass2)
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
            # print(username,pass1)
        
    return render(request,"TCPLapp/login.html")


#logout ______________________________________________________________________
def LogoutPage(request):
    logout(request)
    return redirect('login')

#selection ______________________________________________________________________

# def selection(request):
#      return render(request,"TCPLapp/selection.html")
 
 
   
#coordinates

def coordinates(request):
    return render(request,"TCPLapp/coordinates.html") 


# #kml

# def kml(request):
#     return render(request,"TCPLapp/kml.html") 

# index__________________________________________________

@login_required(login_url='login')
def index(request):
    if request.method == 'POST':
        # Get the uploaded file from the request
        uploaded_file = request.FILES['file']

        # Process the file and save the imported data
        imported_data = process_file(uploaded_file)  # Custom function to process the file

        # Save the imported data to the database or perform any necessary operations
        save_data(imported_data)  # Custom function to save the data

        return render(request, 'import_success.html')

    return render(request, "TCPLapp/index.html")

def process_file(uploaded_file):
    imported_data = []

    # Assuming the file is a CSV file, process it using the csv module
    reader = csv.reader(uploaded_file)
    for row in reader:
        # Assuming each row contains latitude and longitude values separated by a comma
        if len(row) == 2:
            lat = float(row[0])
            lng = float(row[1])
            imported_data.append((lat, lng))

    return imported_data

def save_data(imported_data):
    # Assuming you have a Django model named MyModel to save the data
    for lat, lng in imported_data:
        MyModel.objects.create(latitude=lat, longitude=lng)

def export_kml(request):
    # Retrieve the dynamic coordinates based on user input or any other source
    lat = request.GET.get('lat')  # Example: Get latitude from query parameter
    lng = request.GET.get('lng')  # Example: Get longitude from query parameter
    
    # Create a list of coordinate objects with the dynamic coordinates
    coordinates = [{'lat': lat, 'lng': lng}]
    
    # Generate the KML file content with the selected coordinates
    kml_content = generate_kml_content(coordinates)
    
    response = HttpResponse(kml_content, content_type='application/vnd.google-earth.kml+xml')
    response['Content-Disposition'] = 'attachment; filename="exported_data.kml"'
    return response
def generate_kml_content(coordinates):
    # Logic to generate the KML file content
    # Customize this function based on your specific requirements
     kml_content = '''<?xml version="1.0" encoding="UTF-8"?>
                    <kml xmlns="http://www.opengis.net/kml/2.2">
                        <Document>
                            {% for coordinate in coordinates %}
                            <Placemark>
                                <name>Coordinate</name>
                                <Point>
                                    <coordinates>{{ coordinate.lng }},{{ coordinate.lat }},0</coordinates>
                                </Point>
                            </Placemark>
                            {% endfor %}
                        </Document>
                    </kml>'''

     return kml_content
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



# Pdf
def save_screenshot(request):
    if request.method == "POST":
        image_data = request.POST.get("image")

        # Save the image data as a file
        import base64

        image_data = base64.b64decode(image_data.split(",")[1])

        with open("screenshot.png", "wb") as f:
            f.write(image_data)

        # Return a JSON response indicating success
        return JsonResponse({"message": "Screenshot saved successfully."})
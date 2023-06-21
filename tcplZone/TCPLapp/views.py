from django.shortcuts import render,HttpResponse,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404 
from .models import India, tcplbook
from django.views.decorators.csrf import csrf_exempt

import requests
# import logging



# logger = logging.getLogger(__name__)

# def my_view(request):
#     logger.debug("Debug message")
#     logger.info("Info message")
#     logger.warning("Warning message")
#     logger.error("Error message")
    
#     # Your view logic here
    
#     return HttpResponse("Response")

#Create view here.

@login_required(login_url='login')
def main(request):
    user = request.user
    bookmarks = tcplbook.objects.filter()
    if request.method == 'POST':
        name = request.POST.get('name')
        latitude = request.POST.get('lat')
        longitude = request.POST.get('lng')
        user = request.user
        new_bookmark = tcplbook.objects.create(name=name, latitude=latitude, longitude=longitude)
        new_bookmark.save()
        # return redirect('main')
    return render(request, "TCPLapp/main.html", {'bookmarks': bookmarks})

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
            return redirect('selection')
        else:
            # Handle invalid login credentials
            return render(request, 'TCPLapp/login.html', {'error': 'Invalid login credentials'})
            # print(username,pass1)
        
    return render(request,"TCPLapp/login.html")

#main ______________________________________________________________________
# def main(request):
#         # Get all bookmarks from the database
#     bookmarks = Bookmark.objects.all()
#     context = {'bookmarks': bookmarks}
#     return render(request,"TCPLapp/main.html", context)
  
#logout ______________________________________________________________________
def LogoutPage(request):
    logout(request)
    return redirect('login')

#selection ______________________________________________________________________

def selection(request):
     return render(request,"TCPLapp/selection.html")
   
   
#coordinates

def coordinates(request):
    return render(request,"TCPLapp/coordinates.html") 


#kml

def kml(request):
    return render(request,"TCPLapp/kml.html") 


def india_data(request):
    data = India.objects.all()
    context = {
        'data': data,
    }
    return render(request, 'TCPLapp/india.html', context)


# def create_bookmark(request):
#     print('hellooooooo')
#     return render(request, 'create_bookmark.html')

def save_bookmark(request):
    print("first")
    if request.method == 'POST':
        print("second")
        name = request.POST.get('name')
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        # screenshot = request.FILES.get('screenshot')
        print(latitude, "hello")
        new_bookmark = tcplbook(name=name, latitude=latitude, longitude=longitude)
        new_bookmark.save()
        print(name, "Bookmark saved successfully")
        # return redirect('main')

@csrf_exempt
def delete_location(request):
    if request.method == 'POST':
        location_id = request.POST.get('location_id')
        bookmark = get_object_or_404(Book, pk=location_id)
        bookmark.delete()
        return redirect('main')
    return redirect('main')
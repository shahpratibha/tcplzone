
from django.contrib import admin
from django.urls import path, include
from TCPLapp import views





from django.contrib import admin
from django.urls import path, include
from TCPLapp import views




urlpatterns = [
    path("admin/", admin.site.urls),
    
    path("accounts/", include("django.contrib.auth.urls")),
    
    path('',views.loginPage,name='login'),
    
    path('main/', views.main,name='main'),
    
    path('registration/', views.registration,name='registration'),
    
    path('logout/',views.LogoutPage,name='logout'),
    
    path('coordinates/',views.coordinates,name='coordinates'),
    
    path('index/', views.index,name='index'),
    
    path('autocomplete/', views.autocomplete, name='autocomplete'),
    
    path('searchOnClick/', views.searchOnClick, name='searchOnClick'),
    
    path('Out_table/', views.Out_table, name='Out_table'),
    
    path('save-location/', views.save_location, name='save_location'),
    
    path('get-locations/', views.get_locations, name='get_locations'),
    
    path('delete-location/', views.delete_location, name='delete_location'),
   
    
]
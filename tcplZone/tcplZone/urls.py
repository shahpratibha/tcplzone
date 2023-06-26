
from django.contrib import admin
from django.urls import path, include
from TCPLapp import views



urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("django.contrib.auth.urls")),
    path('main/', views.main,name='main'),
    path('registration/', views.registration,name='registration'),
    path('logout/',views.LogoutPage,name='logout'),
    path('selection/',views.selection,name='selection'),
    path('coordinates/',views.coordinates,name='coordinates'),
    path('kml/',views.kml,name='kml'),
    
    
    path('',views.loginPage,name='login'),
    
    path('save_bookmark/', views.save_bookmark, name='save_bookmark'),
    # path('create_bookmark/', views.create_bookmark, name='create_bookmark'),
    # path('delete-location/', views.delete_location, name='delete_location'),

    path('india/', views.india_data, name='india_data'),
    
]

from django.contrib.auth import authenticate, login as auth_login, logout
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect
from django.shortcuts import render
from django.urls import reverse
#for adding userse
from django.contrib.auth.models import User
from .models import menuItem, Topings, orders, orderItem
import json

# Create your views here.
def index(request, error='none'):
    if not request.user.is_authenticated:
        context = {
            'user' : 'none',
            'menuItems' : menuItem.objects.all(),
            'topings' : Topings.objects.all(),
            'error' : error
        }
        return render(request,'pizza/index.html', context)
    else:
        context ={
            'user' : request.user,
            'menuItems' : menuItem.objects.all(),
            'topings' : Topings.objects.all(),
            'error' : 'none'
        }
        return render(request,'pizza/index.html', context)


def login(request):
    return render(request, 'pizza/login.html')

def menu(request):
    context = {
        'menuItem': menuItem.objects.all(),
        'Topings' : Topings.objects.all()
    }
    return render(request, 'pizza/menu.html', context)

def login_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None : 
        auth_login(request, user)
        response = redirect('/')
        return response
    else :
        context = {
            'user' : 'none',
            'menuItems' : menuItem.objects.all(),
            'topings' : Topings.objects.all(),
            'error' : 'Incorrect User name or password'
        }
        return render(request,'pizza/index.html', context)



def logout_view(request):
    logout(request)
    response = redirect('/')
    return response

def register(request):
    userName = request.POST['userName']
    password = request.POST['password']
    firstName = request.POST['firstName']
    lastName = request.POST['lastName']
    email = request.POST['email']

    user= User.objects.create_user( username= userName,email=email,password =password,first_name =firstName,last_name= lastName )
    user.save()
    return render(request,'pizza/index.html')


def gettopings(request):
    item = menuItem.objects.get(id=request.GET.get('itemId'))
    topimg = Topings.objects.filter(toping=item.toping)
    aList = []
    for value in topimg :
        aList.append(value.name)

    if item.large != 0 : 
        large_price = item.large
    else :
        large_price = 0
    data = {
        #'data': request.GET.get('itemId')
        'data' : aList,
        'price': item.price,
        'large' : large_price
    }
    return JsonResponse(data)


def order(request) :
    response = redirect('/')
    res = json.loads(request.GET.get('order'))
    order = orders(user = User.objects.get(username=request.user.username).username)
    order.save()
    for x in res :
        item = menuItem.objects.get(name=x['item'])
        size = x['size']
        foo = orderItem(item=item,size=size)
        foo.save()
        order.orderItems.add(foo)
        if len(x['topings']) != 0 :
            for i in x['topings']:
                toping = Topings.objects.get(name=i)
                foo.topings.add(toping)
                foo.save()
    order.save()

    data = {'blat': res}
    return JsonResponse(data)

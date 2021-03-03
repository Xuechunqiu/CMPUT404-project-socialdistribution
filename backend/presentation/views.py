from django.shortcuts import render, get_object_or_404, HttpResponseRedirect
from django.http import HttpResponse
from django.urls import reverse
from requests.auth import HTTPBasicAuth
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from presentation.Utils.forms import AuthorForm


@login_required(login_url='/accounts/login')
def home(request):
    if request.method == "POST":
        request_data = request.data.copy()
    return render(request, "home.html")


def register(request):
    if request.method == 'POST':
        form = AuthorForm(request.POST)
        if form.is_valid():
            author = form.save()  # TODO: save() is a function call for Author object
            author.refresh_from_db()  # cause a hard refresh from the database
            raw_password = form.cleaned_data.get('password')
            user = authenticate(
                username=author.user.username, password=raw_password)
            login(request, user)
            return HttpResponseRedirect(reverse(''), args=[request.user.username])
    else:
        form = AuthorForm()
    return render(request, 'registration/register.html', {'form': form})


def login(request):
    pass


def profile(request):
    pass

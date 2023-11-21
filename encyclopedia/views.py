from django.shortcuts import render
import markdown2
from django import forms
from django.core.exceptions import ValidationError 
import re
import random

from . import util

def new_list_validator(title):
    entries_list = [x.lower() for x in util.list_entries()]
    if title.lower() in entries_list:
        raise ValidationError("This title is already in the library!")

class SearchForm(forms.Form):  
    search = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Search Encyclopedia'}))

class NewForm(forms.Form):  
    title = forms.CharField(validators=[new_list_validator], label='', widget=forms.TextInput(attrs={'placeholder': 'Title:'}))
    text = forms.CharField(label='', widget=forms.Textarea(attrs={'placeholder': 'Markdown input:'}))

class EditForm(forms.Form):  
    text = forms.CharField(label='',initial="class", widget=forms.Textarea(attrs={'placeholder': 'Markdown input:'}))

def index(request):
    if request.method == "POST":
        form1 = SearchForm(request.POST)
        entries_list = [x.lower() for x in util.list_entries()]
        if form1.is_valid():
            search = form1.cleaned_data["search"]
            if search.lower() in entries_list:
                title = util.get_entry(search.lower())
                html = markdown2.markdown(title)
                return render(request, "encyclopedia/entry.html", {
                "page": html, "entry": search, "form1": SearchForm()
                })
            else:
                results = []
                for entry in entries_list:
                    my_regex = r".*"+ re.escape(search) + r".*"
                    if re.search(my_regex, entry):
                        results.append(entry.upper())
                return render(request, "encyclopedia/search.html", {
                "results": results, 
                "form1": SearchForm()
                })
        else:
            # If the form is invalid, re-render the page with existing information.
            return render(request, "encyclopedia/index.html", {
                "form1": form1,
            })
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries,
        "form1": SearchForm()
    })

def entry(request, name):
    title = util.get_entry(name)
    if title != None:
        html = markdown2.markdown(title)
        return render(request, "encyclopedia/entry.html", {
            "page": html, "entry": name, "form1": SearchForm()
        })
    else:
        return render(request, "encyclopedia/error.html")
    
def new(request):
    if request.method == "POST":
        form2 = NewForm(request.POST)
        if form2.is_valid():
            title = form2.cleaned_data["title"]
            text = form2.cleaned_data["text"]
            util.save_entry(title, text)
            html = markdown2.markdown(text)
            return render(request, "encyclopedia/entry.html", {
            "page": html, "entry": title, "form1": SearchForm()
            })
        else:
            # If the form is invalid, re-render the page with existing information.
            return render(request, "encyclopedia/new.html", {
                "form1": SearchForm(),
                "form2": form2,
            })
    return render(request, "encyclopedia/new.html", {
        "form1": SearchForm(),
        "form2": NewForm()
    })

def edit(request, entry):
    if request.method == "POST":
        form2 = EditForm(request.POST)
        if form2.is_valid():
            title = entry
            text = form2.cleaned_data["text"]
            util.save_entry(title, text)
            html = markdown2.markdown(text)
            return render(request, "encyclopedia/entry.html", {
            "page": html, "entry": title, "form1": SearchForm()
            })
        else:
            # If the form is invalid, re-render the page with existing information.
            return render(request, "encyclopedia/new.html", {
                "form1": SearchForm(),
                "form2": form2,
            })
    title = util.get_entry(entry)
    if title != None:
        html = markdown2.markdown(title)
        return render(request, "encyclopedia/edit.html", {
            "page": html, "entry": entry,
            "form2": EditForm(initial={"text": title}),
            "form1": SearchForm()
        })
    else:
        return render(request, "encyclopedia/error.html")
    
def whatever(request):
    entries_list = [x.lower() for x in util.list_entries()]
    random_title = random.choice(entries_list)
    title = util.get_entry(random_title)
    if title != None:
        html = markdown2.markdown(title)
        return render(request, "encyclopedia/entry.html", {
            "page": html, "entry": random_title, "form1": SearchForm()
        })
    else:
        return render(request, "encyclopedia/error.html")
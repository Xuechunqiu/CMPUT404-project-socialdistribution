# Generated by Django 2.2.1 on 2021-02-23 04:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.URLField(primary_key=True, serialize=False)),
                ('host', models.URLField()),
                ('displayName', models.CharField(max_length=50)),
                ('url', models.URLField()),
                ('github', models.URLField()),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('summary', models.CharField(max_length=50)),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_actor', to='presentation.Author')),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_object', to='presentation.Author')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('title', models.CharField(max_length=50)),
                ('id', models.CharField(max_length=200, primary_key=True, serialize=False, unique=True)),
                ('source', models.URLField()),
                ('origin', models.URLField()),
                ('description', models.CharField(max_length=200)),
                ('contentType', models.CharField(max_length=50)),
                ('content', models.TextField(blank=True)),
                ('categories', models.CharField(max_length=200)),
                ('count', models.IntegerField()),
                ('size', models.IntegerField()),
                ('comments', models.URLField()),
                ('published', models.DateField()),
                ('visibility', models.CharField(choices=[('PUBLIC', 'PUBLIC'), ('FRIENDS', 'FRIENDS')], default='PUBLIC', max_length=50)),
                ('unlisted', models.BooleanField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='presentation.Author')),
            ],
        ),
        migrations.CreateModel(
            name='Likes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('context', models.URLField()),
                ('summary', models.CharField(max_length=50)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes_author', to='presentation.Author')),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes_object', to='presentation.Author')),
            ],
        ),
        migrations.CreateModel(
            name='Liked',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('items', models.ManyToManyField(blank=True, related_name='liked_items', to='presentation.Likes')),
            ],
        ),
        migrations.CreateModel(
            name='Inbox',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='presentation.Author')),
                ('items', models.ManyToManyField(blank=True, related_name='inbox_items', to='presentation.Post')),
            ],
        ),
        migrations.CreateModel(
            name='Follower',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('items', models.ManyToManyField(blank=True, related_name='follower_items', to='presentation.Author')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('comment', models.TextField()),
                ('contentType', models.CharField(max_length=50)),
                ('published', models.DateField()),
                ('id', models.CharField(max_length=200, primary_key=True, serialize=False, unique=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='presentation.Author')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='presentation.Post')),
            ],
        ),
    ]
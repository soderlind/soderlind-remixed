---
title: 'Local by Flywheel: Using WordMove to mirror sites'
---

(from my post at[ Local Community](https://localbyflywheel.com/community/t/using-wordmove-to-mirror-sites/856)) 

I use [WordMove](http://welaika.github.io/wordmove/) to mirror local Wordpress installations and DB data back and forth from my Local development machine to the remote  server.

If you plan to test this, do it on a new site. 

## Prerequisite

**ssh into your local site** (In the Local dashboard, right click on the site name and select Open SSH):

1) First thing first, run :
```sh
apt update
apt upgrade
```
2) Add essential packages
```sh
apt-get install build-essential git wget rubygems 
```
3) WordMove needs ruby 2.4 or newer. First install `ruby-install` following the guide at https://github.com/postmodern/ruby-install#install

```sh
wget -O ruby-install-0.7.0.tar.gz https://github.com/postmodern/ruby-install/archive/v0.7.0.tar.gz
tar -xzvf ruby-install-0.7.0.tar.gz
cd ruby-install-0.7.0/
make install
```

4) List supported Rubies and their major versions 
```sh
ruby-install
```

5) Install ruby 2.4.x (was 2.4.7 when I wrote this) in /usr/local
```sh
ruby-install --system ruby 2.4.7
```

6) Log out of the terminal and ssh into it again

You'll now have the prerequisites to install WordMove

## WordMove setup

1. **ssh into your local site**  (In the Local dashboard, right click on the site name and select Open SSH)
1. `cd /app/public`
1. Edit wp-config.php and make sure it has the same table prefix as the remote site, don't change anything else.
1. Install WordMove: `gem install wordmove`
1. Create the Movefile by doing: `wordmove init`
1. Edit the Movefile and add Production (and maybe [more environmentes](https://github.com/welaika/wordmove/wiki/Multiple-environments-explained))
1. Pull the remote site, including database and media doing: `wordmove pull -all`

## An exsample Movefile

    local:
      vhost: "http://soderlind.dev"
      wordpress_path: "/app/public" # use an absolute path here

      database:
        name: "local"
        user: "root"
        password: "root"
        host: "localhost"

    production:
      vhost: "https://soderlind.no"
      wordpress_path: "/ABSOULUTE/PATH/TO/WORDPRESS" # use an absolute path here

      database:
        name: "wp"
        user: "wp"
        password: "PASSWORD"
        host: "localhost"

      exclude:
        - ".git/"
        - ".gitignore"
        - ".sass-cache/"
        - "node_modules/"
        - "bin/"
        - "tmp/*"
        - "Gemfile*"
        - "Movefile"
        - "wp-config.php"
        - "wp-content/*.sql"

      ssh:
        host: "SSHHOST"
        user: "SSHUSER"
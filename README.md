# Analytics with ElasticSearch

Slide deck: https://docs.google.com/presentation/d/1ubyoRG08TdUyf_rN_evLnFJ3iWkl1NDT4QzpegS0xqs

## Setup

You will need to have access to the following components:

 * ElasticSearch
 * Kibana
 * nodejs

### Setup ElasticSearch & Kibana

You can either setup ElasticSearch and Kibana locally on your machine or you can use one of the many cloud providers available to get yourself an instance.

Installing ElasticSearch locally:

https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html

```sh
brew install elasticsearch
brew services start elasticsearch
```

Installing Kibana locally:

https://www.elastic.co/guide/en/kibana/current/install.html

```sh
brew install kibana
brew services start kibana
```

Installing ElasticSearch and Kibana on AWS:

http://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-createupdatedomains.html

### Setup Node & Project

You can either install and work on the project locally using your favorite shell or editor, or you can use an online service like WebpackBin to host the code for you.

Installing node locally:

https://nodejs.org/en/download/

```sh
brew install node
```

Getting the project locally:

```sh
git clone https://github.com/metalabdesign/startupslam-2017.git
cd startupslam-2017
npm install
npm run dev
open http://localhost:8080
```

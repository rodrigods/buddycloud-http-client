/*
 * Copyright 2012 Denis Washington <denisw@online.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

requirejs.config({
  baseUrl: 'js',
  paths: {
    'config': '../config',
    'templates': '../templates'
  }
});

define(function(require) {
  var $ = require('jquery');
  var Channel = require('app/models/Channel');
  var config = require('config');
  var FollowerList = require('app/views/FollowerList');
  var LoginSidebar = require('app/views/LoginSidebar');
  var MetadataPane = require('app/views/MetadataPane');
  var PostStream = require('app/views/PostStream');
  var SubscribedChannels = require('app/models/SubscribedChannels');
  var SubscribedChannelsList = require('app/views/SubscribedChannelsList');
  var UserCredentials = require('app/models/UserCredentials');
  var UserMenu = require('app/views/UserMenu');

  function initialize() {
    var channel = getRequestedChannel();
    var channelModel = new Channel(channel);
		var subscribedChannels = new SubscribedChannels();
    getUserCredentials(function(credentials) {
      setupChannelUI(channelModel, subscribedChannels, credentials);
      fetch(channelModel.metadata, credentials);
      fetch(channelModel.posts, credentials);
      fetch(channelModel.followers, credentials);
      fetch(subscribedChannels, credentials);
    });
  }

  function getRequestedChannel() {
    return document.location.search.slice(1) || config.defaultChannel;
  }

  function getUserCredentials(callback) {
    var credentials = new UserCredentials;
    credentials.fetch();
    credentials.on('accepted', function() {
      callback(credentials);
    });
    credentials.on('rejected', function() {
      alert('Authentication failed');
      credentials.set({username: null, password: null});
      credentials.verify();
    });
    credentials.verify();
  }

  function setupChannelUI(channelModel, subscribedChannels, credentials) {
    $('#content').append(new MetadataPane({model: channelModel.metadata}).el);
    $('#content').append(new PostStream({model: channelModel.posts}).el);
    $('#right').append(new FollowerList({model: channelModel.followers}).el);
    if (credentials.username) {
      var userMenu = new UserMenu({model: credentials});
      $('#toolbar-right').append(userMenu.el);
      userMenu.render();

      $('#left').append(new SubscribedChannelsList({model: subscribedChannels}).el);
    } else {
      var sidebar = new LoginSidebar({model: credentials});
      $('#left').append(sidebar.el);
      sidebar.render();
    }
  }

  function fetch(model, credentials) {
    model.fetch({
      headers: {'Authorization': credentials.toAuthorizationHeader()},
      xhrFields: {withCredentials: true}
    });
  }

  initialize();
});

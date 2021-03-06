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

define(function(require) {
  var api = require('app/util/api');
  var Backbone = require('backbone');
  var Post = require('app/models/Post');

  var ChannelPosts = Backbone.Collection.extend({
    model: Post,

    constructor: function(channel) {
      Backbone.Collection.call(this);
      this.channel = channel;
    },

    url: function() {
      return api.url(this.channel, 'content', 'posts');
    },

    fetch: function(options) {
      // Explicitly set "Accept: application/json" so that we get the
      // JSON representation instead of an Atom feed.
      options = options || {};
      options.headers = options.headers || {};
      options.headers['Accept'] = 'application/json';
      Backbone.Collection.prototype.fetch.call(this, options);
    },

    byThread: function() {
      var incompleteThreads = {};
      var completeThreads = [];

      // Note that the items returned by the buddycloud
      // API are sorted from newest to oldest.
      this.models.forEach(function(item) {
        var threadId = item.get('replyTo') || item.get('id');
        var thread = incompleteThreads[threadId];
        if (!thread) {
          thread = incompleteThreads[threadId] = [];
        }
        thread.unshift(item);
        if (!item.get('replyTo')) { // is top-level post
          completeThreads.push(thread);
          delete incompleteThreads[threadId];
        }
      });

      return completeThreads;
    }
  });

  return ChannelPosts;
});
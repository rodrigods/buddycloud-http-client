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
	var $ = require('jquery');
  var _ = require('underscore');
  var avatarFallback = require('app/util/avatarFallback');
  var Backbone = require('backbone');
  var template = require('text!templates/MetadataPane.html');

  var MetadataPane = Backbone.View.extend({
    tagName: 'header',
    className: 'metadata-pane',
		events: {'click .follow': '_follow',
						 'click .unfollow': '_unfollow'},

    initialize: function() {
      this.model.metadata.bind('change', this.render, this);
		},

    render: function() {
 	    this.$el.html(_.template(template, {metadata: this.model.metadata}));
			this._renderButton();
			avatarFallback(this.$('img'), this.model.metadata.channelType(), 64);
    },

		_renderButton: function() {
			var username = this.options.credentials.username;
			if (username) {
				var followers = this.model.followers.usernames();
			  var button = $('<button class="unfollow">Unfollow</button>');
				if (_.has(followers, username)) {
					button = $('<button class="follow">Follow</button>');
				}
				this.$('.description').after(button);	
			}
		},

		_follow: function() {
			// POST node/subscription 
			this._updateButton('follow', 'unfollow', 'Unfollow');
		},

		_unfollow: function() {
			//DELETE node/subscription
			this._updateButton('unfollow', 'follow', 'Follow');
		},

		_updateButton: function(oldClass, newClass, label) {
 	  	var button = $('.' + oldClass);
			button.removeClass(oldClass).addClass(newClass);
			//update label button.button('option', 'label', label);
		}
  });

  return MetadataPane;
});

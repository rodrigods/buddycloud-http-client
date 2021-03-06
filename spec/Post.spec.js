/*
 * Copyright 2012 Denis Washington <denisw@online.de>
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function(require) {
  var Post = require('app/models/Post');

  describe('Post', function() {
    var post;

    beforeEach(function() {
      post = new Post({
          author: 'alice@example.com',
          published: '2012-01-01',
          updated: '2012-01-02',
          replyTo: 'foo',
          content: 'A post from Alice'
        });
    });

    it('should have an accessor for each post attribute', function() {
      expect(post.author()).toBe('alice@example.com');
      expect(post.published()).toBe('2012-01-01');
      expect(post.updated()).toBe('2012-01-02');
      expect(post.replyTo()).toBe('foo');
      expect(post.content()).toBe('A post from Alice');
    });

    describe('updated()', function() {
      it('should equal published() if not explicitly specified', function() {
        post.set({updated: null});
        expect(post.updated()).toBe(post.published());
      });
    });
  });

});
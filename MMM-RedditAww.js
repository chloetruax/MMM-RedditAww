/* global Module */

/* Magic Mirror
 * Module: MM Reddit Posts From r/aww
 *
 * By Mike Truax
 * MIT Licensed.
 */

Module.register("MMM-RedditAww", {

	// Default module config.
	defaults: {
		postChangeTime: 60000,
		postUpdateTime: 1200000,
		showVideos: true
	},
	posts: [],
	changeInterval: null,

	// Define start sequence.
	start: function () {
		Log.info("Starting module:" + this.name);
		if (!config.postChangeTime) {
			config.postChangeTime = this.defaults.postChangeTime;
		}
		if (!config.postUpdateTime) {
			config.postUpdateTime = this.defaults.postUpdateTime;
		}
		if (!config.showVideos) {
			config.showVideos = this.defaults.showVideos;
		}
		this.getPosts();
		setInterval(this.getPosts, this.config.postUpdateTime);

	},
	getStyles: function () {
		return ["MMM-RedditAww.css"];
	},

	getPosts: function () {
		if (this.changeInterval) {
			clearInterval(this.changeInterval);
		}
		let self = this;
		fetch('https://www.reddit.com/r/writingprompts/hot.json')
			.then(res => res.json())
			.then(json => json.data.children)
			.then(posts => posts.filter(p => {
				if (!self.showVideos) {
					return !p.data.sticky && !p.data.is_video
				}
				return !p.data.stickied
			}
			))
			.then(posts => {
				self.posts = posts;
				self.updateDom();
				self.changeInterval = setInterval(self.updateDom(), self.config.postChangeTime)
			})
	},
	// Override dom generator.
	getDom: function () {
		let rdmPost = this.posts[Math.floor(Math.random()*this.posts.length)].data
		let wrapper = document.createElement("div");
		wrapper.classList.add("aww-container");
		let title = document.createElement("div")
		title.classList.add("aww-title");
		title.innerText = rdmPost.title;
		wrapper.appendChild(title);
		let mediaElement = rdmPost.is_video ? this.buildVideo(rdmPost) : this.buildImg(rdmPost)
		wrapper.appendChild(mediaElement);
		return wrapper;
	},
	buildVideo(video){
		let videoElement = document.createElement("video");
		videoElement.classList.add("aww-video");
		video.setAttribute("autoplay", "");
		video.setAttribute("loop", "");
		let source = document.createElement("source");
		source.src = video.secure_media.reddit_video.fallback_url;
		videoElement.appendChild("source");
		return videoElement;
	},
	buildImg(img){
		let imgElement = document.createElement("img");
		imgElement.classList.add("aww-img");
		imgElement.src = img.preview.images[0].source.url;
		return img;
	}

});

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
		postChangeTime: 10000,
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
		let self = this;
		setInterval(function(){self.getPosts()}, this.config.postUpdateTime);
	},
	getStyles: function () {
		return ["MMM-RedditAww.css"];
	},

	getPosts: function () {
		if (this.changeInterval) {
			clearInterval(this.changeInterval);
		}
		let self = this;
		fetch('https://www.reddit.com/r/aww/hot.json')
			.then(res => res.json())
			.then(json => json.data.children)
			.then(posts => posts.filter(p => {
				if (!self.showVideos) {
					return !p.data.stickied && !p.data.is_video
				}
				return !p.data.stickied
			}
			))
			.then(posts => {
				self.posts = posts;
				self.updateDom();
				self.changeInterval = setInterval(
					function(){self.updateDom()}, self.config.postChangeTime)
			})
	},
	// Override dom generator.
	getDom: function () {
		let wrapper = document.createElement("div");
		if(this.posts.length == 0){
			return wrapper;
		}
		let rdmPost = this.posts[Math.floor(Math.random()*this.posts.length)].data
		if(rdmPost.crosspost_parent_list){
			rdmPost = rdmPost.crosspost_parent_list[0];
		}
		wrapper.classList.add("aww-container");
		let title = document.createElement("div")
		title.classList.add("aww-title");
		title.innerText = rdmPost.title;
		wrapper.appendChild(title);
		let mediaContainer = document.createElement("div");
		if(rdmPost.secure_media || rdmPost.secure_media_embed.content || rdmPost.url.includes(".gifv")){
			mediaContainer.innerHTML = this.buildVideo(rdmPost);
		}
		else{
			mediaContainer.innerHTML = this.buildImg(rdmPost)
		}
		wrapper.appendChild(mediaContainer);
		return wrapper;
	},
	buildVideo(video){
		if(!video.secure_media_embed.content){
			let src = video.secure_media ? video.secure_media.reddit_video.fallback_url : video.url.replace("gifv", "mp4");
			return `<video class="aww-video" muted autoplay loop src=${src}></video>`;
		}
		return `<img class="aww-img" src="${video.secure_media.oembed.thumbnail_url}">`
	},
	buildImg(img){
		return `<img class="aww-img" src=${img.url}>`;
	},
});
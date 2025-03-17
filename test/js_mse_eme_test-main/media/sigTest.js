/**
 * @license
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Format Support Test Suite.
 * @class
 */
var SigTest = function() {

  var tests = [];

  var createFunctionalTest =
      function(testId, name, category = 'Functional', mandatory = true) {
    var t = createTest(name, category, mandatory, testId, 'Format Support Tests');
    t.prototype.index = tests.length;
    tests.push(t);
    return t;
  };

  /**
   * Validate if VP9 live format can be played.
   */
  var createLivePlaybackSupportTest = function(
      testId, videoStream, audioStream, expectedPlayTimeInS, sizeToFetch) {
    var test = createFunctionalTest(
        testId, sizeToFetch ? 'PartialSegmentPlayback' : 'Playback', 'VP9 Live');
    test.prototype.title = 'Test if playback of VP9 live format is supported.';
    test.prototype.start = function(runner, video) {
      var ms = new MediaSource();
      var videoSb;
      var audioSb;
    // console.log("SIG PRINT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    // console.log("test-materials/media/big-buck-bunny-h264-1080p-60fps.mp4")
    // new_src="test-materials/media/big-buck-bunny-h264-1080p-60fps.mp4"
    // video.src = new_src;
      ms.addEventListener('sourceopen', function() {
        videoSb = ms.addSourceBuffer(videoStream.mimetype);
        audioSb = ms.addSourceBuffer(audioStream.mimetype);
      });
      video.src = window.URL.createObjectURL(ms);

      var videoXhr = runner.XHRManager.createRequest(
          videoStream.src, function(e) {
        videoSb.appendBuffer(this.getResponseData());
        video.addEventListener('timeupdate', function(e) {
          console.log(video.videoHeight)
          if (!video.paused && video.currentTime > expectedPlayTimeInS) {
            runner.succeed();
          }
        }, 0, sizeToFetch);
        video.play();
      });
      var audioXhr = runner.XHRManager.createRequest(
          audioStream.src, function(e) {
        audioSb.appendBuffer(this.getResponseData());
        videoXhr.send();
      }, 0, sizeToFetch);
      audioXhr.send();
    };
  };

  var createSigMSEVideoTest = function(
    testId, videoStream, audioStream, expectedPlayTimeInS, sizeToFetch) {
  var test = createFunctionalTest(
      testId, sizeToFetch ? '2180p Resolution' : 'Playback', 'Resolution Test');
  test.prototype.title = 'TEST .';
  test.prototype.start = function(runner, video) {
    var ms = new MediaSource();
    var videoSb;
    var new_src="test-materials/media/av1/bbb_sunflower_2160p60.mp4"

    console.log(new_src)
    const MIME_CODEC = 'video/mp4; codecs="avc1.640033"';
    ms.addEventListener('sourceopen', function() {
      videoSb = ms.addSourceBuffer(MIME_CODEC);
    });
    video.src = window.URL.createObjectURL(ms);

    var videoXhr = runner.XHRManager.createRequest(
      new_src, function(e) {
        console.log(this.getResponseData())
        videoSb.addEventListener("sourceend",
          function() {
            ms.endOfStream();
            video.play();
          }
        )
      
        videoSb.appendBuffer(this.getResponseData());
        video.play();
      
      video.addEventListener('timeupdate', function(e) {
        console.log(video.videoHeight, "x", video.videoWidth)
        if (!video.paused && video.currentTime > expectedPlayTimeInS) {
          runner.succeed();
        }
      }, 0, 243930);
      // video.play();
    });
    videoXhr.send();

  };
};

var createSigResolutionTest = function(
  testId, video_src, title, expectedPlayTimeInS, sizeToFetch) {
var test = createFunctionalTest(
    testId, title, 'Resolution Test');
test.prototype.title = 'TEST .';
test.prototype.start = function(runner, video) {
  var ms = new MediaSource();
  var videoSb;
  var new_src=video_src

  console.log(new_src)
  const MIME_CODEC = 'video/mp4; codecs="av01.0.05M.08"';
  ms.addEventListener('sourceopen', function() {
    videoSb = ms.addSourceBuffer(MIME_CODEC);
  });
  video.src = window.URL.createObjectURL(ms);

  var videoXhr = runner.XHRManager.createRequest(
    new_src, function(e) {
      console.log(this.getResponseData())
      videoSb.addEventListener("sourceend",
        function() {
          ms.endOfStream();
          video.play();
        }
      )
    
      videoSb.appendBuffer(this.getResponseData());
      video.play();
    
    video.addEventListener('timeupdate', function(e) {
      
      // if (video.videoHeight != )
      // 2160 'x' 3840
      console.log(video.videoHeight, "x", video.videoWidth)
      if (video.videoHeight != 2160 || video.videoWidth != 3840) {
        runner.fail()
      }

      
      if (!video.paused && video.currentTime > expectedPlayTimeInS) {
        runner.succeed();
      }
    }, 0, 243930);
    // video.play();
  });
  videoXhr.send();

};
};

var createSigFrameRateTest = function(
    testId, video_src, title, expectedPlayTimeInS, sizeToFetch, mimeType='video/mp4; codecs="av01.0.05M.08"') {
  var test = createFunctionalTest(
      testId, title, 'Frame Rate Test');
  test.prototype.title = 'TEST .';
  test.prototype.start = function(runner, video) {
    var ms = new MediaSource();
    var videoSb;
    var new_src=video_src

    console.log(new_src)
    // MIME_CODEC = 'video/mp4; codecs="av01.0.05M.08"';
    // var MIME_CODEC = 'video/mp4; codecs="avc1.42c00c"';
    var MIME_CODEC = mimeType;
    // avc1.42c00c
    ms.addEventListener('sourceopen', function() {
      videoSb = ms.addSourceBuffer(MIME_CODEC);
    });
    video.src = window.URL.createObjectURL(ms);

    var videoXhr = runner.XHRManager.createRequest(
      new_src, function(e) {
        console.log(this.getResponseData())
        videoSb.addEventListener("sourceend",
          function() {
            ms.endOfStream();
            video.play();
          }
        )
      
        videoSb.appendBuffer(this.getResponseData());
        video.play();
      
      video.addEventListener('timeupdate', function(e) {
        
        // var currentVideoTime = video.currentTime
        // var quality=video.getVideoPlaybackQuality()
        // var total = quality.totalVideoFrames;
        // var dropped = quality.droppedVideoFrames;

        // var rendered = total - dropped;
        // var fps = rendered/ currentVideoTime;
        // var droppedPercentage = (dropped / total) * 100
        // console.log("[",currentVideoTime,"] => ", fps, " | dropped : ", droppedPercentage)

        // if (droppedPercentage > 40) {
        //   runner.fail()
        // }

        if (!video.paused && video.currentTime > expectedPlayTimeInS) {
          runner.succeed();
        }
      }, 0, 243930);
      // video.play();
    });
    videoXhr.send();

  };
  };

  console.log(Media.VP9.VideoLive)
  // createLivePlaybackSupportTest(
  //     '20.3.1.1', Media.VP9.VideoHuge, Media.AAC.AudioForVP9Live, 14);
  // createSigMSEVideoTest(
  //     '20.3.2.1', Media.VP9.VideoLive, Media.AAC.AudioForVP9Live, 3, 80000);
  createSigResolutionTest(
    '20.3.2.1', "test-materials/media/av1/bbb_sunflower_2160p60.mp4", "720p60", 5, 80000);
  createSigFrameRateTest(
      '20.3.3.1', "test-materials/media/av1/bbb_sunflower_720p60.mp4", "720p60", 5, 80000);
  createSigFrameRateTest(
    '20.3.4.1', "test-materials/media/av1/bbb_sunflower_1440p60.mp4", "1440p60", 5, 80000);
  createSigFrameRateTest(
    '20.3.5.1', "test-materials/media/av1/bbb_sunflower_2160p30.mp4", "2160p30", 5, 80000);
  createSigFrameRateTest(
    '20.3.6.1', "test-materials/media/av1/bbb_sunflower_2160p60.mp4", "2160p60", 5, 80000);
  createSigFrameRateTest(
    '20.3.6.2', "test-materials/media/av1/hdr2_hlg_24fps_4k.mp4", "24fps", 5, 80000);
  createSigFrameRateTest(
    '20.3.6.3', "test-materials/media/av1/hdr3_hlg_30fps_480p.mp4", "30fps", 5, 80000);
  createSigFrameRateTest(
    '20.3.6.3', "test-materials/media/av1/big-buck-bunny-h264-144p-15fps.mp4", "15fps", 5, 80000, 'video/mp4; codecs="avc1.42c00c"');

    // big-buck-bunny-h264-144p-15fps

  return {tests: tests, viewType: 'default'};
};

try {
  exports.getTest = SigTest;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}

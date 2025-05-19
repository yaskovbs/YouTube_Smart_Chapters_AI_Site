const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileId = uuidv4();
    const fileExt = path.extname(file.originalname);
    cb(null, `${fileId}${fileExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  }
}).single('video');

/**
 * Process a YouTube video URL
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.processVideoUrl = async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'YouTube URL is required'
      });
    }

    // Validate URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    // Get video info
    const videoInfo = await ytdl.getInfo(url);
    const videoId = videoInfo.videoDetails.videoId;
    const title = videoInfo.videoDetails.title;
    const duration = parseInt(videoInfo.videoDetails.lengthSeconds);
    
    // Return basic video info
    return res.status(200).json({
      success: true,
      data: {
        videoId,
        title,
        duration,
        url
      }
    });
  } catch (error) {
    console.error('Error processing YouTube URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing YouTube URL',
      error: error.message
    });
  }
};

/**
 * Upload a video file
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.uploadVideo = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded'
      });
    }

    const fileId = path.basename(req.file.filename, path.extname(req.file.filename));
    
    // Get video duration
    ffmpeg.ffprobe(req.file.path, (err, metadata) => {
      if (err) {
        console.error('Error getting video metadata:', err);
        return res.status(500).json({
          success: false,
          message: 'Error processing uploaded video',
          error: err.message
        });
      }
      
      const duration = Math.floor(metadata.format.duration);
      
      return res.status(200).json({
        success: true,
        data: {
          fileId,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          path: req.file.path,
          duration
        }
      });
    });
  });
};

/**
 * Get video information
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.getVideoInfo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if it's a YouTube video ID
    if (ytdl.validateID(id)) {
      const videoInfo = await ytdl.getInfo(id);
      return res.status(200).json({
        success: true,
        data: {
          videoId: videoInfo.videoDetails.videoId,
          title: videoInfo.videoDetails.title,
          duration: parseInt(videoInfo.videoDetails.lengthSeconds),
          author: videoInfo.videoDetails.author.name,
          thumbnails: videoInfo.videoDetails.thumbnails
        }
      });
    } else {
      // Assume it's a file ID
      const uploadsDir = path.join(__dirname, '../uploads');
      const files = fs.readdirSync(uploadsDir);
      const videoFile = files.find(file => file.startsWith(id));
      
      if (!videoFile) {
        return res.status(404).json({
          success: false,
          message: 'Video not found'
        });
      }
      
      const filePath = path.join(uploadsDir, videoFile);
      
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error getting video metadata',
            error: err.message
          });
        }
        
        return res.status(200).json({
          success: true,
          data: {
            fileId: id,
            filename: videoFile,
            duration: Math.floor(metadata.format.duration),
            size: metadata.format.size,
            format: metadata.format.format_name
          }
        });
      });
    }
  } catch (error) {
    console.error('Error getting video info:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting video info',
      error: error.message
    });
  }
};

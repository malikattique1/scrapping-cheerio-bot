// const { eventNames } = require("../../config/database");
// const pool = require("../../config/database");
// const categoryController = require("../category/category.controller");
// const stickerpackService = require("../stickerpack/stickerpack.service");

// module.exports = {
//   create: (data, callBack) => {
//     // console.log(data)
//     pool.query(
//       `insert into wallpaper(title, description, category, thumbnail_path,thumbnail_width,wallpaper_height,wallpaper_type,home_and_lock_paths,orientation,is_premium,is_editor_choice,privacy,author,tags,wallpaper_size,views,downloads,likes,comments) 
//                 values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ;
//                  SELECT id,name FROM tags WHERE id IN (${JSON.stringify(data.tags)})`,
//       [
//         data.title,
//         data.description,
//         data.category,
//         data.thumbnail_path,
//         data.thumbnail_width,
//         data.wallpaper_height,
//         data.wallpaper_type,
//         data.home_and_lock_paths,
//         data.orientation,
//         data.is_premium,
//         data.is_editor_choice,
//         data.privacy,
//         data.author,
//         // data.tags.join(', '),
//         JSON.stringify(data.tags),
//         data.wallpaper_size,
//         data.views,
//         data.downloads,
//         data.likes,
//         data.comments
//       ],
//       (error, results, fields) => {
//         if (error) {
//           callBack(error);
//         }
//         return callBack(null, results);
//       }
//     );
//   },

// };

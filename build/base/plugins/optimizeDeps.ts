import fs from "fs";
import path from "path";

const rootPath = path.resolve(__dirname, `./`);

/**
 * 优化预加载依赖
 */
export function optimizeDeps() {
  return {
    name: "optimizeDeps",
    configResolved: (config) => {
      console.log(config.optimizeDeps);
      let concat = config.optimizeDeps.include.concat(optimizeAntd());

      config.optimizeDeps.include = Array.from(new Set(concat));
    },
  };
}

/**
 * 优化 antd
 */
function optimizeAntd(): string[] {
  let includes: string[] = ["element-plus/es"];
  const folders = fs.readdirSync(
    path.resolve(rootPath, `./node_modules/element-plus/es`)
  );
  folders.map((name) => {
    const folderName = path.resolve(
      rootPath,
      `./node_modules/element-plus/es`,
      name
    );
    let stat = fs.lstatSync(folderName);
    if (stat.isDirectory()) {
      let styleFolder = path.resolve(folderName, "style");
      if (fs.existsSync(styleFolder)) {
        let stat = fs.lstatSync(styleFolder);
        if (stat.isDirectory()) {
          includes.push(`element-plus/es/${name}/style`);
        }
      }
    }
  });

  return includes;
}
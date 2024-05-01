/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack: (config, options) => {
        config.resolve.fallback = {
          fs: false,
        }

        config.module.rules.unshift({
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false, // disable the behavior
          },
        });

        config.plugins = (config.plugins || []).concat([
          new options.webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
          }),
        ]);
    
        return config;
      },
};

export default nextConfig;

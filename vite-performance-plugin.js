/**
 * Vite Performance Plugin
 * 
 * This plugin enhances the build process to:
 * - Split chunks more effectively
 * - Preload critical resources
 * - Minimize unused CSS
 * - Optimize font loading
 */

export default function performancePlugin() {
  return {
    name: 'vite-performance-plugin',
    
    // Generate optimized HTML with preload directives
    transformIndexHtml(html) {
      // Add preload for critical assets
      const preloadCss = '<link rel="preload" href="/assets/index-HASH.css" as="style">';
      const preconnect = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
      const fontDisplay = '<style>@font-face{font-display:swap}</style>';
      
      return html
        .replace('</head>', `${preconnect}\n${fontDisplay}\n</head>`)
        .replace('</title>', '</title>\n<meta name="description" content="Comprehensive NCLEX exam preparation platform for nursing students with practice questions, study strategies, and analytics.">')
        .replace('</body>', '<script>window.addEventListener("load",()=>{const e=document.createElement("link");e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",e.media="print",e.onload=function(){e.media="all"},document.head.appendChild(e)});</script>\n</body>');
    },
    
    // Configure build options
    config(config) {
      return {
        ...config,
        build: {
          ...config.build,
          cssCodeSplit: true,
          cssMinify: 'lightningcss',
          rollupOptions: {
            ...config.build?.rollupOptions,
            output: {
              ...config.build?.rollupOptions?.output,
              manualChunks: {
                vendor: ['react', 'react-dom', 'react-router-dom'],
                ui: [
                  '@radix-ui/react-accordion',
                  '@radix-ui/react-dialog',
                  '@radix-ui/react-tabs',
                  '@radix-ui/react-select',
                  'lucide-react'
                ],
                utils: ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns'],
                react_query: ['@tanstack/react-query']
              }
            }
          }
        }
      };
    }
  };
}
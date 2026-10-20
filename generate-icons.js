const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [64, 192, 512];
const colors = {
  primary: '#0f172a',
  secondary: '#3b82f6',
  text: '#ffffff'
};

console.log('Generating PWA icons...');

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = colors.primary;
  ctx.fillRect(0, 0, size, size);
  
  // Circle in center
  ctx.fillStyle = colors.secondary;
  const circleRadius = size * 0.3;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, circleRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // L letter
  ctx.fillStyle = colors.text;
  const fontSize = size * 0.4;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('L', size / 2, size / 2);
  
  // Border
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = size * 0.02;
  ctx.strokeRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8);
  
  // Save PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/pwa-${size}x${size}.png`, buffer);
  console.log(`Created: public/pwa-${size}x${size}.png`);
  
  // For maskable icon
  if (size === 512) {
    const maskableCanvas = createCanvas(size, size);
    const maskableCtx = maskableCanvas.getContext('2d');
    
    // Rounded rectangle for maskable
    maskableCtx.fillStyle = colors.primary;
    const radius = size * 0.2;
    maskableCtx.beginPath();
    maskableCtx.moveTo(radius, 0);
    maskableCtx.lineTo(size - radius, 0);
    maskableCtx.arcTo(size, 0, size, radius, radius);
    maskableCtx.lineTo(size, size - radius);
    maskableCtx.arcTo(size, size, size - radius, size, radius);
    maskableCtx.lineTo(radius, size);
    maskableCtx.arcTo(0, size, 0, size - radius, radius);
    maskableCtx.lineTo(0, radius);
    maskableCtx.arcTo(0, 0, radius, 0, radius);
    maskableCtx.closePath();
    maskableCtx.fill();
    
    // L letter in center
    maskableCtx.fillStyle = colors.text;
    const letterSize = size * 0.35;
    maskableCtx.font = `bold ${letterSize}px Arial`;
    maskableCtx.textAlign = 'center';
    maskableCtx.textBaseline = 'middle';
    maskableCtx.fillText('L', size / 2, size / 2);
    
    const maskableBuffer = maskableCanvas.toBuffer('image/png');
    fs.writeFileSync(`public/maskable-icon-${size}x${size}.png`, maskableBuffer);
    console.log(`Created: public/maskable-icon-${size}x${size}.png`);
  }
});

console.log('Icon generation complete!');

// Also create apple-touch-icon.png
const appleCanvas = createCanvas(180, 180);
const appleCtx = appleCanvas.getContext('2d');

appleCtx.fillStyle = colors.primary;
appleCtx.fillRect(0, 0, 180, 180);

appleCtx.fillStyle = colors.secondary;
const appleRadius = 180 * 0.3;
appleCtx.beginPath();
appleCtx.arc(90, 90, appleRadius, 0, Math.PI * 2);
appleCtx.fill();

appleCtx.fillStyle = colors.text;
appleCtx.font = 'bold 72px Arial';
appleCtx.textAlign = 'center';
appleCtx.textBaseline = 'middle';
appleCtx.fillText('L', 90, 90);

const appleBuffer = appleCanvas.toBuffer('image/png');
fs.writeFileSync('public/apple-touch-icon.png', appleBuffer);
console.log('Created: public/apple-touch-icon.png');
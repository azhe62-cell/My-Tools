import os
import json

base_dir = r"f:\My Tools"

dirs = [
    "assets/css",
    "assets/js",
    "blog"
]

for d in dirs:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

blog_titles = [
    "What is a QR Code and how does it work?",
    "How to create a QR Code for free (step-by-step)",
    "QR Code for WhatsApp: Complete guide",
    "Are QR Codes safe?",
    "How to increase typing speed (WPM guide)",
    "What is a good typing speed in 2026?",
    "Best free typing test tools online",
    "How many words is 1000 characters?",
    "Best free word counter tools",
    "Character vs word count explained",
    "How to calculate age manually",
    "Age difference calculator guide",
    "Top 10 free online tools for students",
    "Best productivity tools websites in 2026",
    "Free online tools you should use daily"
]

def to_slug(title):
    return ''.join(c if c.isalnum() else '-' for c in title.lower()).replace('--', '-').strip('-') + '.html'

def generate_html(title, content, current_path=""):
    prefix = "../" if current_path == "blog" else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{title} - Free online tools for everyone.">
    <title>{title} | My Tools</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{prefix}assets/css/style.css">
</head>
<body>
    <nav class="sidebar">
        <div class="logo">
            <i class="fa-solid fa-wrench text-gold"></i>
            <h2>My Tools</h2>
        </div>
        <ul class="nav-links">
            <li><a href="{prefix}index.html" class="nav-btn"><i class="fa-solid fa-house"></i> Home</a></li>
            <li><a href="{prefix}index.html#tools" class="nav-btn"><i class="fa-solid fa-toolbox"></i> Tools</a></li>
            <li><a href="{prefix}blog.html" class="nav-btn"><i class="fa-solid fa-blog"></i> Blog / Guides</a></li>
            <li><a href="{prefix}about.html" class="nav-btn"><i class="fa-solid fa-circle-info"></i> About Us</a></li>
            <li><a href="{prefix}contact.html" class="nav-btn"><i class="fa-solid fa-envelope"></i> Contact Us</a></li>
        </ul>
        <div class="ad-placeholder sidebar-ad">
            <p>Ad Space</p>
        </div>
    </nav>
    <main class="main-content">
        <header class="topbar">
            <div class="mobile-toggle"><i class="fa-solid fa-bars"></i></div>
            <div class="search-bar">
                <i class="fa-solid fa-search"></i>
                <input type="text" placeholder="Search tools or articles...">
            </div>
            <div class="user-actions">
                <button class="btn btn-primary"><i class="fa-solid fa-bolt"></i> Premium</button>
            </div>
        </header>

        <div class="content-wrapper">
{content}
        </div>
        
        <footer>
            <div class="footer-content">
                <div class="footer-links">
                    <a href="{prefix}about.html">About Us</a>
                    <a href="{prefix}contact.html">Contact Us</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
                <p>&copy; 2026 My Tools. All rights reserved.</p>
            </div>
        </footer>
    </main>
    <!-- Tool Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    <script src="{prefix}assets/js/main.js"></script>
    <script src="{prefix}assets/js/tools.js"></script>
</body>
</html>"""

# Generate 15 Blog Posts
for title in blog_titles:
    content = f"""
            <article class="blog-post">
                <h1 class="text-gold gradient-text">{title}</h1>
                <div class="post-meta">
                    <span><i class="fa-regular fa-calendar"></i> April 6, 2026</span>
                    <span><i class="fa-regular fa-clock"></i> 5 min read</span>
                </div>
                <div class="post-content card">
                    <p>Welcome to our comprehensive guide on <strong>{title}</strong>. This article will walk you through everything you need to know about this topic.</p>
                    <h2>1. Introduction</h2>
                    <p>Understanding and utilizing online tools effectively can save you hours of work. In this guide, we dive deep into the specific methods and best practices regarding {title}.</p>
                    <h2>2. Why is this important?</h2>
                    <p>In 2026, efficiency is key. By using the right tools and strategies, professionals, students, and businesses can automate mundane tasks.</p>
                    <h2>3. How to use it?</h2>
                    <p>Just head over to our main dashboard and select the appropriate tool. Our tools are built with speed and user-friendliness in mind.</p>
                    
                    <div class="cta-box">
                        <h3>Ready to get started?</h3>
                        <p>Use our free tools below to get started instantly.</p>
                        <a href="../index.html" class="btn btn-primary lg-btn">Go to Tools Dashboard</a>
                    </div>
                </div>
            </article>
    """
    with open(os.path.join(base_dir, "blog", to_slug(title)), "w", encoding="utf-8") as f:
        f.write(generate_html(title, content, "blog"))

# Blog Index Page
blog_cards = ""
for title in blog_titles:
    blog_cards += f"""
                <div class="blog-card card">
                    <div class="blog-card-img"><i class="fa-solid fa-newspaper fa-3x text-gold"></i></div>
                    <div class="blog-card-content">
                        <h3><a href="blog/{to_slug(title)}">{title}</a></h3>
                        <p>Learn more in our detailed guide...</p>
                        <a href="blog/{to_slug(title)}" class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>"""

blog_index_content = f"""
            <section class="page-section">
                <div class="section-header">
                    <h1 class="gradient-text">Blog & Guides</h1>
                    <p>Discover tips, tutorials, and deep dives into productivity tools.</p>
                </div>
                <div class="blog-grid">
                    {blog_cards}
                </div>
            </section>
"""
with open(os.path.join(base_dir, "blog.html"), "w", encoding="utf-8") as f:
    f.write(generate_html("Blog & Guides", blog_index_content))

# Index Page Content
index_content = """
            <!-- Hero Section -->
            <section class="hero card text-center glass-card">
                <h1 class="gradient-text lg-text">All-in-One Free Online Tools<br>Fast, Simple & Powerful</h1>
                <p class="subtitle">Generate QR codes, calculate, convert, and boost productivity with our premium tools.</p>
                <a href="#tools" class="btn btn-primary lg-btn glow-btn"><i class="fa-solid fa-rocket"></i> Start Using Tools</a>
            </section>

            <div class="ad-placeholder banner-ad">
                <p>Ad Space - Top Banner</p>
            </div>

            <!-- Tools Sections -->
            <section id="tools" class="tools-section">
                <div class="section-header">
                    <h2 class="gradient-text">Our Tools Collection</h2>
                    <p>Select a tool below to begin</p>
                </div>

                <div class="tools-grid">
                    <!-- Tool Cards -->
                    <div class="tool-card card" onclick="openTool('qr-tool')">
                        <div class="icon-wrap"><i class="fa-solid fa-qrcode text-gold fa-2x"></i></div>
                        <h3>QR Generator</h3>
                        <p>Create customizable QR codes instantly.</p>
                    </div>
                    <div class="tool-card card" onclick="openTool('barcode-tool')">
                        <div class="icon-wrap"><i class="fa-solid fa-barcode text-gold fa-2x"></i></div>
                        <h3>Barcode Gen</h3>
                        <p>Generate standard barcodes easily.</p>
                    </div>
                    <div class="tool-card card" onclick="openTool('word-tool')">
                        <div class="icon-wrap"><i class="fa-solid fa-font text-gold fa-2x"></i></div>
                        <h3>Word Counter</h3>
                        <p>Count words, characters, and sentences.</p>
                    </div>
                    <div class="tool-card card" onclick="openTool('typing-tool')">
                        <div class="icon-wrap"><i class="fa-solid fa-keyboard text-gold fa-2x"></i></div>
                        <h3>Typing Test</h3>
                        <p>Check your WPM and accuracy speed.</p>
                    </div>
                    <div class="tool-card card" onclick="openTool('age-tool')">
                        <div class="icon-wrap"><i class="fa-solid fa-calendar-days text-gold fa-2x"></i></div>
                        <h3>Age Calculator</h3>
                        <p>Calculate precise age from DOB.</p>
                    </div>
                    <div class="tool-card card" onclick="openTool('currency-tool')">
                        <div class="icon-wrap"><i class="fa-solid fa-coins text-gold fa-2x"></i></div>
                        <h3>Currency Calc</h3>
                        <p>Convert 80+ global currencies.</p>
                    </div>
                    <div class="tool-card card" onclick="openTool('morse-tool')">
                        <div class="icon-wrap"><i class="fa-solid fa-walkie-talkie text-gold fa-2x"></i></div>
                        <h3>Morse Code</h3>
                        <p>Translate text to morse code & back.</p>
                    </div>
                </div>
            </section>
            
            <!-- Tool Container (Hidden by default, shown when tool is clicked) -->
            <section id="tool-container" class="tool-view hidden">
                <button class="btn btn-outline back-btn" onclick="closeTool()"><i class="fa-solid fa-arrow-left"></i> Back to Tools</button>
                
                <!-- QR Code Tool -->
                <div id="qr-tool" class="tool-interface card hidden">
                    <h2 class="gradient-text">QR Code Generator</h2>
                    <div class="tool-layout">
                        <div class="tool-input">
                            <label>Enter Text or URL</label>
                            <input type="text" id="qr-input" class="modern-input" placeholder="https://example.com">
                            <button id="qr-btn" class="btn btn-primary w-100">Generate QR</button>
                        </div>
                        <div class="tool-output">
                            <div id="qrcode-canvas" class="output-box glass-box"></div>
                        </div>
                    </div>
                </div>

                <!-- Barcode Tool -->
                <div id="barcode-tool" class="tool-interface card hidden">
                    <h2 class="gradient-text">Barcode Generator</h2>
                    <div class="tool-layout">
                        <div class="tool-input">
                            <label>Enter Code Value</label>
                            <input type="text" id="barcode-input" class="modern-input" placeholder="1234567890">
                            <button id="barcode-btn" class="btn btn-primary w-100">Generate Barcode</button>
                        </div>
                        <div class="tool-output text-center glass-box">
                            <svg id="barcode-canvas"></svg>
                        </div>
                    </div>
                </div>

                <!-- Word Counter -->
                <div id="word-tool" class="tool-interface card hidden">
                    <h2 class="gradient-text">Word & Character Counter</h2>
                    <div class="tool-layout-vertical">
                        <textarea id="word-input" class="modern-input lg-textarea" placeholder="Type or paste your text here..."></textarea>
                        <div class="stats-grid mt-3">
                            <div class="stat-box glass-box">
                                <span class="stat-num text-gold" id="word-count">0</span>
                                <span class="stat-label">Words</span>
                            </div>
                            <div class="stat-box glass-box">
                                <span class="stat-num text-gold" id="char-count">0</span>
                                <span class="stat-label">Characters</span>
                            </div>
                            <div class="stat-box glass-box">
                                <span class="stat-num text-gold" id="char-no-space">0</span>
                                <span class="stat-label">Without Spaces</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Typing Test -->
                <div id="typing-tool" class="tool-interface card hidden">
                    <h2 class="gradient-text">Typing Speed Test</h2>
                    <div class="typing-container">
                        <div class="typing-stats stats-grid mb-3">
                            <div class="stat-box glass-box"><span class="stat-label">Time</span><span class="stat-num text-gold" id="time-display">60s</span></div>
                            <div class="stat-box glass-box"><span class="stat-label">WPM</span><span class="stat-num text-gold" id="wpm-display">0</span></div>
                            <div class="stat-box glass-box"><span class="stat-label">Accuracy</span><span class="stat-num text-gold" id="acc-display">100%</span></div>
                        </div>
                        <div class="difficulty-select mb-3 text-center">
                            <button class="btn btn-outline diff-btn active" data-diff="easy">Easy</button>
                            <button class="btn btn-outline diff-btn" data-diff="medium">Medium</button>
                            <button class="btn btn-outline diff-btn" data-diff="hard">Hard</button>
                        </div>
                        <div class="glass-box p-4 text-box">
                            <p id="quote-display" class="quote-text">Click start to begin typing test...</p>
                        </div>
                        <textarea id="typing-input" class="modern-input mt-3" placeholder="Start typing here..." disabled></textarea>
                        <button id="start-typing-btn" class="btn btn-primary mt-3 w-100">Start Test</button>
                    </div>
                </div>

                <!-- Age Calculator -->
                <div id="age-tool" class="tool-interface card hidden">
                    <h2 class="gradient-text">Age Calculator</h2>
                    <div class="tool-layout">
                        <div class="tool-input">
                            <label>Date of Birth</label>
                            <input type="date" id="dob-input" class="modern-input">
                            <button id="age-btn" class="btn btn-primary w-100 mt-2">Calculate Age</button>
                        </div>
                        <div class="tool-output">
                            <div class="glass-box text-center p-4">
                                <h3 id="age-result" class="text-gold lg-text">--</h3>
                                <p id="age-details">Years, Months, Days</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Currency Calculator -->
                <div id="currency-tool" class="tool-interface card hidden">
                    <h2 class="gradient-text">Currency Calculator</h2>
                    <div class="tool-layout">
                        <div class="tool-input">
                            <label>Amount</label>
                            <input type="number" id="curr-amount" class="modern-input" value="1">
                            <div class="flex-row mt-2" style="display:flex; gap:10px;">
                                <div style="flex:1;">
                                    <label>From</label>
                                    <select id="curr-from" class="modern-input"><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="JPY">JPY</option><option value="INR">INR</option></select>
                                </div>
                                <div style="flex:1;">
                                    <label>To</label>
                                    <select id="curr-to" class="modern-input"><option value="EUR">EUR</option><option value="USD">USD</option><option value="GBP">GBP</option><option value="INR">INR</option><option value="JPY">JPY</option></select>
                                </div>
                            </div>
                            <button id="curr-btn" class="btn btn-primary w-100 mt-3">Convert</button>
                        </div>
                        <div class="tool-output">
                            <div class="glass-box text-center p-4">
                                <p class="stat-label">Converted Amount</p>
                                <h3 id="curr-result" class="text-gold lg-text mt-2">--</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Morse Code -->
                <div id="morse-tool" class="tool-interface card hidden">
                    <h2 class="gradient-text">Morse Code Translator</h2>
                    <div class="tool-layout-vertical">
                        <textarea id="morse-input" class="modern-input" placeholder="Type text to convert to morse, or morse (with spaces) to convert to text..."></textarea>
                        <div class="flex-row my-3" style="display:flex; gap:10px;">
                            <button id="to-morse-btn" class="btn btn-primary flex-1">Text to Morse</button>
                            <button id="to-text-btn" class="btn btn-outline flex-1">Morse to Text</button>
                        </div>
                        <div class="glass-box p-4 min-h-100 text-gold break-words" id="morse-output">Result will appear here...</div>
                    </div>
                </div>
            </section>
"""

with open(os.path.join(base_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(generate_html("Home", index_content))

# About Page
about_content = """
            <section class="page-section card">
                <h1 class="gradient-text text-center">About Us</h1>
                <div class="about-content mt-4" style="max-width: 800px; margin: auto; text-align: center; line-height: 1.8;">
                    <i class="fa-solid fa-ranking-star fa-4x text-gold mb-3"></i>
                    <p class="lg-text">Our mission is to provide powerful, free, and easy-to-use online tools for everyone.</p>
                    <p>We focus on simplicity, speed, and premium user experience. Whether you're a student, developer, or professional, our platform helps you complete tasks efficiently without complexity.</p>
                    <p>Built with modern technology, "My Tools" stands out with a sleek, luxury black and gold dashboard. We prioritize data privacy and instant results.</p>
                </div>
            </section>
"""
with open(os.path.join(base_dir, "about.html"), "w", encoding="utf-8") as f:
    f.write(generate_html("About Us", about_content))

# Contact Page
contact_content = """
            <section class="page-section card">
                <h1 class="gradient-text text-center">Contact Us</h1>
                <p class="text-center">Got a question or suggestion? Send us a message.</p>
                
                <div class="contact-layout mt-4" style="max-width: 600px; margin: auto;">
                    <form id="contact-form" class="glass-box p-4" onsubmit="event.preventDefault(); alert('Message sent!');">
                        <div class="form-group mb-3">
                            <label>Name</label>
                            <input type="text" class="modern-input" required placeholder="John Doe">
                        </div>
                        <div class="form-group mb-3">
                            <label>Email</label>
                            <input type="email" class="modern-input" required placeholder="john@example.com">
                        </div>
                        <div class="form-group mb-3">
                            <label>Message</label>
                            <textarea class="modern-input lg-textarea" required placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 glow-btn">Send Message</button>
                        <p class="text-center mt-3 text-sm" style="color: #888;">We typically respond within 24 hours.</p>
                    </form>
                </div>
            </section>
"""
with open(os.path.join(base_dir, "contact.html"), "w", encoding="utf-8") as f:
    f.write(generate_html("Contact Us", contact_content))

# CSS
css_content = \"\"\"
:root {
    --bg-main: #0b0b0b;
    --bg-card: #151515;
    --bg-glass: rgba(25, 25, 25, 0.6);
    --gold: #d4af37;
    --gold-glow: rgba(212, 175, 55, 0.4);
    --text-main: #ededed;
    --text-muted: #888888;
    --border-color: rgba(212, 175, 55, 0.2);
    --sidebar-width: 260px;
    --trans: 0.3s ease;
}

* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
body { background-color: var(--bg-main); color: var(--text-main); display: flex; min-height: 100vh; overflow-x: hidden; }

/* Utilities */
.text-gold { color: var(--gold); }
.gradient-text {
    background: linear-gradient(90deg, #d4af37, #f3e5ab);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.text-center { text-align: center; }
.mt-2 { margin-top: 0.5rem; } .mt-3 { margin-top: 1rem; } .mt-4 { margin-top: 2rem; }
.mb-3 { margin-bottom: 1rem; } .my-3 { margin-top: 1rem; margin-bottom: 1rem; }
.p-4 { padding: 1.5rem; }
.w-100 { width: 100%; } .flex-1 { flex: 1; }
.lg-text { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
.text-sm { font-size: 0.85rem; }
.hidden { display: none !important; }
.break-words { word-break: break-all; }
.min-h-100 { min-height: 100px; }

/* Sidebar */
.sidebar {
    width: var(--sidebar-width);
    background-color: #080808;
    border-right: 1px solid var(--border-color);
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    z-index: 100;
}
.sidebar .logo { display: flex; align-items: center; gap: 10px; font-size: 1.5rem; margin-bottom: 3rem; }
.nav-links { list-style: none; flex-grow: 1; }
.nav-links li { margin-bottom: 0.5rem; }
.nav-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 15px; color: var(--text-muted);
    text-decoration: none; border-radius: 8px;
    transition: var(--trans);
    font-weight: 500;
}
.nav-btn:hover, .nav-btn.active {
    background-color: rgba(212, 175, 55, 0.1);
    color: var(--gold);
}

/* Layout */
.main-content {
    flex: 1;
    margin-left: var(--sidebar-width);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.topbar {
    height: 70px;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 2rem;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-main);
    z-index: 50;
    position: sticky; top: 0;
}
.mobile-toggle { display: none; cursor: pointer; font-size: 1.5rem; color: var(--gold); }
.search-bar {
    display: flex; align-items: center; gap: 10px;
    background: var(--bg-card); padding: 8px 15px; border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.05); width: 300px;
}
.search-bar input { background: transparent; border: none; color: #fff; outline: none; width: 100%; }
.content-wrapper { padding: 2rem; flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; }

/* Components */
.card {
    background-color: var(--bg-card);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.glass-card {
    background: var(--bg-glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
}
.glass-box {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
}

/* Buttons */
.btn {
    padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer;
    transition: var(--trans); text-decoration: none; display: inline-block;
}
.btn-primary { background: linear-gradient(45deg, #d4af37, #aa8529); color: #000; }
.btn-primary:hover { box-shadow: 0 0 15px var(--gold-glow); transform: translateY(-2px); }
.btn-outline { background: transparent; border: 1px solid var(--gold); color: var(--gold); }
.btn-outline:hover, .btn-outline.active { background: rgba(212, 175, 55, 0.1); }
.lg-btn { padding: 15px 30px; font-size: 1.1rem; }
.glow-btn { animation: pulse 2s infinite; }
@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
    100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
}

/* Inputs */
.modern-input {
    width: 100%; background: #0f0f0f; border: 1px solid rgba(255,255,255,0.1);
    color: #fff; padding: 12px 15px; border-radius: 8px; outline: none; transition: var(--trans);
}
.modern-input:focus { border-color: var(--gold); }
.lg-textarea { min-height: 150px; resize: vertical; }

/* Grid / Tools */
.tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
.tool-card { cursor: pointer; transition: 0.4s ease; text-align: center; }
.tool-card:hover { transform: translateY(-5px); border-color: var(--gold); box-shadow: 0 10px 20px var(--gold-glow); }
.icon-wrap { margin-bottom: 1rem; }
.tool-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem; }
@media(max-width: 768px) { .tool-layout { grid-template-columns: 1fr; } }
.tool-interface { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Output & Stats */
.output-box { display: flex; justify-content: center; align-items: center; min-height: 250px; padding: 1rem; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; }
.stat-box { padding: 1.5rem; }
.stat-num { font-size: 2rem; font-weight: 700; display: block; }
.stat-label { font-size: 0.9rem; color: var(--text-muted); }

/* Ads */
.ad-placeholder { background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
.sidebar-ad { margin-top: auto; height: 150px; border-radius: 8px; }
.banner-ad { height: 90px; margin: 2rem 0; width: 100%; border-radius: 8px; }

/* Blog */
.blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
.blog-card { overflow: hidden; padding: 0; }
.blog-card-img { height: 150px; background: #080808; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
.blog-card-content { padding: 1.5rem; }
.blog-card-content h3 { margin-bottom: 0.5rem; font-size: 1.2rem; }
.blog-card-content h3 a { color: #fff; text-decoration: none; transition: var(--trans); }
.blog-card-content h3 a:hover { color: var(--gold); }
.read-more { display: inline-block; margin-top: 1rem; color: var(--gold); text-decoration: none; font-weight: 500; font-size: 0.9rem;}
.blog-post { max-width: 800px; margin: 0 auto; }
.post-meta { display: flex; gap: 15px; color: var(--text-muted); margin: 1rem 0 2rem 0; font-size: 0.9rem; }
.post-content h2 { margin: 1.5rem 0 1rem 0; color: var(--gold); }
.post-content p { line-height: 1.7; margin-bottom: 1rem; color: #ccc; }
.cta-box { background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.2); padding: 2rem; border-radius: 8px; text-align: center; margin-top: 3rem; }

/* Footer */
footer { border-top: 1px solid var(--border-color); padding: 2rem; margin-top: 3rem; background: #080808; }
.footer-content { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
.footer-links { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
.footer-links a { color: var(--text-muted); text-decoration: none; transition: var(--trans); }
.footer-links a:hover { color: var(--gold); }

/* Responsive */
@media(max-width: 900px) {
    .sidebar { transform: translateX(-100%); transition: var(--trans); }
    .sidebar.active { transform: translateX(0); }
    .main-content { margin-left: 0; }
    .mobile-toggle { display: block; }
}
\"\"\"
with open(os.path.join(base_dir, "assets/css/style.css"), "w", encoding="utf-8") as f:
    f.write(css_content)

# JS Main
js_main = \"\"\"
// Sidebar Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const sidebar = document.querySelector('.sidebar');
if(mobileToggle){
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Tool Navigation
function openTool(toolId) {
    document.getElementById('tools').classList.add('hidden');
    document.getElementById('tool-container').classList.remove('hidden');
    
    // Hide all tools
    document.querySelectorAll('.tool-interface').forEach(t => t.classList.add('hidden'));
    
    // Show requested
    document.getElementById(toolId).classList.remove('hidden');
    
    // Scroll to top smoothly
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function closeTool() {
    document.getElementById('tool-container').classList.add('hidden');
    document.getElementById('tools').classList.remove('hidden');
    
    // Scroll to tools
    document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
}

// URL checking for direct tool link
window.addEventListener('DOMContentLoaded', () => {
    if(window.location.hash) {
        const hash = window.location.hash.substring(1); // remove #
        if(hash.endsWith('tool')) {
            openTool(hash);
        }
    }
});
\"\"\"
with open(os.path.join(base_dir, "assets/js/main.js"), "w", encoding="utf-8") as f:
    f.write(js_main)

# JS Tools
js_tools = \"\"\"
// 1. QR Code Generator
const qrBtn = document.getElementById('qr-btn');
if(qrBtn){
    qrBtn.addEventListener('click', () => {
        const input = document.getElementById('qr-input').value;
        const canvasContainer = document.getElementById('qrcode-canvas');
        canvasContainer.innerHTML = ''; // clear
        if(input.trim() === '') { alert('Please enter text or URL'); return; }
        
        new QRCode(canvasContainer, {
            text: input,
            width: 200,
            height: 200,
            colorDark : "#d4af37",
            colorLight : "#0b0b0b",
            correctLevel : QRCode.CorrectLevel.H
        });
    });
}

// 2. Barcode Generator
const barcodeBtn = document.getElementById('barcode-btn');
if(barcodeBtn){
    barcodeBtn.addEventListener('click', () => {
        const input = document.getElementById('barcode-input').value;
        if(input.trim() === '') { alert('Please enter code value'); return; }
        try {
            JsBarcode("#barcode-canvas", input, {
                format: "CODE128",
                lineColor: "#d4af37",
                background: "#0b0b0b",
                width: 2,
                height: 100,
                displayValue: true
            });
        } catch(e) {
            alert('Invalid barcode format.');
        }
    });
}

// 3. Word Counter
const wordInput = document.getElementById('word-input');
if(wordInput){
    wordInput.addEventListener('input', () => {
        const text = wordInput.value;
        const chars = text.length;
        const charsNoSpace = text.replace(/\\s/g, '').length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\\s+/).length;
        
        document.getElementById('word-count').innerText = words;
        document.getElementById('char-count').innerText = chars;
        document.getElementById('char-no-space').innerText = charsNoSpace;
    });
}

// 4. Age Calculator
const ageBtn = document.getElementById('age-btn');
if(ageBtn){
    ageBtn.addEventListener('click', () => {
        const dobVal = document.getElementById('dob-input').value;
        if(!dobVal) return;
        
        const dob = new Date(dobVal);
        const today = new Date();
        
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();
        
        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12;
        }
        if (days < 0) {
            const tempDate = new Date(today.getFullYear(), today.getMonth(), 0);
            days += tempDate.getDate();
            months--;
        }
        
        document.getElementById('age-result').innerText = years + " Years";
        document.getElementById('age-details').innerText = `${months} Months, ${days} Days`;
    });
}

// 5. Currency Calculator (Mock implementation for static site)
const currBtn = document.getElementById('curr-btn');
if(currBtn) {
    // Mock rates relative to USD
    const rates = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 151.2, INR: 83.4 };
    currBtn.addEventListener('click', () => {
        const amt = parseFloat(document.getElementById('curr-amount').value);
        const from = document.getElementById('curr-from').value;
        const to = document.getElementById('curr-to').value;
        
        if(isNaN(amt)) return;
        
        const inUSD = amt / rates[from];
        const result = inUSD * rates[to];
        
        document.getElementById('curr-result').innerText = result.toFixed(2) + ' ' + to;
    });
}

// 6. Morse Code
const toMorseBtn = document.getElementById('to-morse-btn');
const toTextBtn = document.getElementById('to-text-btn');
if(toMorseBtn) {
    const morseDict = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
        '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
        '9': '----.', '0': '-----', ' ': ' / '
    };
    
    // Reverse dictionary
    const reverseDict = {};
    for (const [key, value] of Object.entries(morseDict)) {
        reverseDict[value] = key;
    }

    toMorseBtn.addEventListener('click', () => {
        const text = document.getElementById('morse-input').value.toUpperCase();
        let result = '';
        for(let i=0; i<text.length; i++){
            const char = text[i];
            if(morseDict[char]) {
                result += morseDict[char] + ' ';
            } else if (char !== ' ') {
                result += char + ' ';
            }
        }
        document.getElementById('morse-output').innerText = result.trim() || 'No valid characters';
    });

    toTextBtn.addEventListener('click', () => {
        const morse = document.getElementById('morse-input').value.trim().split(' ');
        let result = '';
        for(let i=0; i<morse.length; i++){
            const code = morse[i];
            if(code === '/') result += ' ';
            else if(reverseDict[code]) result += reverseDict[code];
            else result += code;
        }
        document.getElementById('morse-output').innerText = result || 'No valid morse code';
    });
}

// 7. Typing Test
const typeStartBtn = document.getElementById('start-typing-btn');
if(typeStartBtn) {
    const quotes = {
        easy: ["The sun is shining.", "A cat sat on the mat.", "I love to eat apples."],
        medium: ["Success is not final, failure is not fatal.", "Life is what happens when you're busy making other plans."],
        hard: ["To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer.", "The robust system architectures depend on highly resilient infrastructure protocols."]
    };
    
    let timer = 60;
    let interval = null;
    let playing = false;
    let currentQuote = "";
    
    const diffBtns = document.querySelectorAll('.diff-btn');
    let currentDiff = 'easy';
    
    diffBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(playing) return;
            diffBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentDiff = e.target.getAttribute('data-diff');
        });
    });
    
    typeStartBtn.addEventListener('click', () => {
        const quoteBox = document.getElementById('quote-display');
        const input = document.getElementById('typing-input');
        
        if(!playing) {
            playing = true;
            timer = 60;
            const quoteList = quotes[currentDiff];
            currentQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
            quoteBox.innerText = currentQuote;
            
            input.disabled = false;
            input.value = '';
            input.focus();
            typeStartBtn.innerText = 'Stop Test';
            document.getElementById('wpm-display').innerText = '0';
            document.getElementById('acc-display').innerText = '100%';
            
            interval = setInterval(() => {
                timer--;
                document.getElementById('time-display').innerText = timer + 's';
                
                calculateTypingStats(input.value, currentQuote);
                
                if(timer <= 0) {
                    endTest();
                }
            }, 1000);
        } else {
            endTest();
        }
    });
    
    document.getElementById('typing-input').addEventListener('input', (e) => {
        if(e.target.value === currentQuote) {
            endTest();
        }
    });
    
    function endTest() {
        playing = false;
        clearInterval(interval);
        document.getElementById('typing-input').disabled = true;
        typeStartBtn.innerText = 'Start Test';
    }
    
    function calculateTypingStats(typed, actual) {
        const wordsTyped = typed.trim().split(/\\s+/).length;
        const mins = (60 - timer) / 60 || 1/60;
        const wpm = Math.round(wordsTyped / mins);
        
        let correct = 0;
        for(let i=0; i<typed.length; i++) {
            if(typed[i] === actual[i]) correct++;
        }
        const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
        
        document.getElementById('wpm-display').innerText = isNaN(wpm) || wpm === Infinity ? 0 : wpm;
        document.getElementById('acc-display').innerText = acc + '%';
    }
}
\"\"\"
with open(os.path.join(base_dir, "assets/js/tools.js"), "w", encoding="utf-8") as f:
    f.write(js_tools)

print("Site built successfully.")

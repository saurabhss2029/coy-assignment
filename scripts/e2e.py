from playwright.sync_api import sync_playwright
U=__import__("os").environ.get("BASE_URL","http://localhost:3000")
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={"width":390,"height":780},device_scale_factor=2,has_touch=True)
    pg=ctx.new_page(); errs=[]
    pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
    pg.on("pageerror",lambda e: errs.append(str(e)))
    pg.goto(U); pg.wait_for_selector(".card.top")
    name=lambda: pg.inner_text(".card.top h2").split("\n")[0]
    print("first card:",name())
    pg.screenshot(path="docs/01-discover.png")

    def drag(dx):
        box=pg.locator(".card.top").bounding_box()
        x,y=box["x"]+box["width"]/2, box["y"]+box["height"]/2
        pg.mouse.move(x,y); pg.mouse.down()
        for i in range(1,11): pg.mouse.move(x+dx*i/10,y)
        return x,y
    # mid-drag screenshot with LIKE stamp
    x,y=drag(90); pg.screenshot(path="docs/02-dragging.png"); pg.mouse.up()
    pg.wait_for_timeout(300)
    print("small drag snapped back, still:",name())
    # full right drag on Aarav -> match
    drag(200); pg.mouse.up()
    pg.wait_for_selector(".matchcard",timeout=3000)
    print("match overlay:",pg.inner_text(".matchcard h2"))
    pg.screenshot(path="docs/03-match.png")
    pg.click("text=Keep swiping"); pg.wait_for_timeout(200)
    print("next card:",name())
    # drag left (pass) on next
    drag(-200); pg.mouse.up(); pg.wait_for_timeout(600)
    print("after pass:",name())
    # buttons
    pg.click(".round.like"); pg.wait_for_timeout(600); print("after like btn:",name())
    # reload persistence
    pg.reload(); pg.wait_for_selector(".card.top"); print("after reload:",name())
    pg.click("text=Matches"); pg.wait_for_selector(".mrow")
    print("matches:",pg.locator(".mrow strong").all_inner_texts())
    pg.click(".mrow"); pg.screenshot(path="docs/04-matches.png")
    # keyboard
    pg.click(".seg button:first-child"); pg.keyboard.press("ArrowLeft"); pg.wait_for_timeout(600); print("after key:",name())
    # tab bar: Home blank
    pg.click(".tab:has-text('Home')"); print("home children:",pg.locator(".home-blank").count(), "discover visible:",pg.locator(".discover").count())
    pg.click(".tab:has-text('Discover')")
    # swipe through everyone -> empty state, no repeats
    seen=set(); 
    while pg.locator(".card.top").count():
        n=name()
        assert n not in seen, "REPEAT "+n; seen.add(n)
        pg.click(".round.pass"); pg.wait_for_timeout(420)
    print("seen unique via loop:",len(seen))
    pg.wait_for_selector(".empty"); pg.screenshot(path="docs/05-empty.png")
    print("empty:",pg.inner_text(".empty h2"))
    print("console errors:",errs)
    b.close()

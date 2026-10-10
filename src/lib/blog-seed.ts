import type { BlogPost } from "./types";

/**
 * Seed posts for the blog — researched against real industry checklists,
 * cost surveys and Michigan campground data, then written in the lot's voice.
 * Source of truth for the first-run catalog; admin edits live in Mongo.
 */
export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    slug: "used-rv-inspection-checklist",
    title: "The Used RV Inspection Checklist We Run on Every Unit",
    excerpt:
      "A 30-point walkthrough covering roof seals, water intrusion, slide-outs, brakes and propane — the same list our techs use on the lot before a camper is priced.",
    category: "Buying Guides",
    tags: [
      "used RV inspection",
      "RV buying checklist",
      "inspect a used camper",
      "used travel trailers",
      "pre-purchase RV inspection",
    ],
    author: "Dana Whitfield",
    date: "2026-09-18",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/services-interior.jpg",
    featured: true,
    status: "live",
    body: `A camper can shine under the LED lights on the lot and still hide five figures of damage. Water gets in through one tired roof seal, sits behind a wall panel for a season, and by the time the carpet feels soft the repair is a full gut job. That is why every unit we take in gets walked roof-to-tires before anyone writes a price on it — and why we hand you the report whether it helps us or not.

This is the actual list we run. Use it yourself, on our lot or anyone else's.

## Start on the roof, because that is where 80% of damage starts

Get up there with a flashlight. Run your hand along every seam, around every vent, the air conditioner gasket and the antenna mount.

- **Sealant condition.** Dicor and putty tape crack and pull away after a few Michigan winters. Cracked sealant is a $200 fix today and a delaminated sidewall in three years.
- **Soft spots.** Walk the membrane. Any give underfoot means the decking underneath is rotting.
- **Stains or streaks** running down from vents or the AC — that is a leak that already happened.

Then check the same spots from inside: ceiling panels around vents, the backs of overhead cabinets, and under the kitchen and bath sinks.

## Water intrusion inside

Water damage hides better than anything else on a used camper.

1. **Pull back the window valances** and feel the wall. Soft or crumbly means rot.
2. **Check the floor** around the toilet, entry door and fridge. Spongy flooring is the number-one tell.
3. **Look for delamination** — bubbles or waves in the fiberglass sidewall. Stand at the back corner of the unit and sight along the wall in low light.
4. **Smell for must.** Not the stale-damp smell of a camper that has been closed up — a sour, earthy smell means mold.
5. **Run every faucet** for a full minute, including the outside shower, and watch the drains. Slow drain or a drip under the cabinet both count against the unit.

## Slide-outs and awnings

Hit the slide buttons and stand back. A slide that shudders, runs at different speeds, or stops before fully extending is telling you the gears, tracks or seals need work. Around the slide, inspect the wiper seals for tears — a torn seal dumps water into the wall every time it rains on the road. Same check on the awning: look for mildew stains, frayed fabric and a roller tube that bends.

## Tires, brakes and the frame

- **DOT date codes.** Tires age out even with tread. We replace anything over six years old — see our tire date code guide for how to read them.
- **Sidewall cracking** and flat spots from sitting.
- **Brake adjusters** on trailers, and rotor condition on motorhomes.
- **Frame rust.** Michigan road salt eats trailer frames. Look at the tongue, the leaf spring hangers and where the axle meets the frame — surface rust is normal, flaking metal is not.
- **Bearing caps.** Grease weeping past the cap means a repack is overdue.

## Propane, electrical and appliances

Light every burner on the range, the furnace and the water heater. Run the A/C for ten minutes and check that it actually cools. Test the fridge on both propane and electric — absorption fridges that sit unused lose their charge and are expensive to revive. Turn on every interior light and every outlet with a tester. Check the house battery: a battery that will not hold a charge after an overnight shore hookup is due for replacement.

Propane is the one thing you should not eyeball — if you smell gas, or the fittings look oxidized, walk away until a certified tech leaks-checks the system.

## The paperwork

Ask for the VIN and run it. Confirm the title is clean and matches the seller's ID. Request service records — roof reseals, bearing repacks, winterization receipts. If it is a flood-state unit or has a rebuilt title, no price is low enough.

## What we do differently on Michigan Ave

Every camper we sell passes a 120-point inspection built on this checklist plus the parts that bite in our climate: underbody salt damage, battery health after storage, and a full run of every system on shore power. You get the written report before you pay anything — including the items we repaired and the ones we chose not to hide.

Bring your own inspector too. We would rather spend an afternoon proving the unit is clean than spend a year hearing about it.`,
  },
  {
    slug: "winterize-your-rv-checklist",
    title: "Winterizing Your RV: The Step-by-Step Fall Checklist",
    excerpt:
      "Drain the tanks, blow out the lines at 30 PSI or less, bypass the water heater and run pink antifreeze — the full sequence that keeps Michigan freezes from cracking your plumbing.",
    category: "Maintenance",
    tags: [
      "winterize an RV",
      "RV winterization checklist",
      "RV antifreeze",
      "RV storage prep",
      "Michigan RV winter",
    ],
    author: "Dana Whitfield",
    date: "2026-09-26",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/gallery-kitchen.jpg",
    featured: false,
    status: "live",
    body: `The first hard freeze of the year does the damage, and it does it quietly. A half-gallon of water left in a P-trap, a water heater tank that was never drained, or a line with a low-point you forgot — that is all it takes to split a fitting while the camper sits under a snow load for four months.

Winterizing is an afternoon of work if you do it in the right order. The order matters more than the products.

## Before you start

Turn off and unplug the water heater. Relieve the pressure by popping the relief valve. If your unit has a bypass valve for the water heater, find it now — it is usually behind an access panel in the pass-through storage or under the fridge. You want to bypass the tank so you are not pouring gallons of antifreeze into a 60-gallon steel drum that is going to drain out anyway.

## 1. Drain everything

- Fresh water tank — open the low-point drains and the tank valve.
- Water heater — remove the drain plug or anode rod and let it run clear, then empty.
- Gray and black tanks — dump at a station, then flush the black tank if you have a wash fitting.
- Water pump — many pumps have a drain, and the strainer bowl unscrews to empty.

Leave every faucet and the outside shower open while you drain, so air gets in and water gets out.

## 2. Blow out the lines

Connect a regulator to your air compressor and set it to **30 PSI or less**. Higher pressure can damage fittings and the tubing in the walls — this is the step where people cause the very leak they were trying to prevent.

Work faucet by faucet: cold, then hot, until only air comes through. Do the outside shower, the toilet flush valve if it is plumbed, and any ice maker line. Keep a hand on the line — the water will spit and sputter before it runs dry, and that sputter is normal.

## 3. Bypass the water heater

Confirm the bypass is open so antifreeze flows through the hot lines but not into the tank. Run the hot side of every faucet until you see pink. Then close the bypass.

## 4. Pump pink antifreeze through the system

Use RV-specific propylene glycol — the pink stuff. Automotive antifreeze is toxic and will not do.

Drop the pump intake hose into the jug and turn the pump on. Open each faucet, hot then cold, until pink flows steady. Flush the toilet until the bowl runs pink, and pour a cup down it after to protect the seal. Run the water pump until the jug runs empty — you will hear the tone change.

Do not skip the P-traps: pour a cup of antifreeze down every drain, including the shower and the galley. The trap holds water that will freeze.

## 5. Everything that is not plumbing

- **Propane:** shut the tanks off and cover the regulator.
- **Battery:** pull it and store it on a maintainer in a garage, not on the concrete floor.
- **Fridge:** empty it, clean it, prop the door open so it does not smell by spring.
- **Slide toppers and awnings:** roll in, brush off debris.
- **Roof:** one more sealant walk in the fall is cheaper than one in the spring.
- **Tires:** wash off the salt, check pressure, and park off asphalt if you can — covers help but tire shine does not beat shade.
- **Rodents:** steel wool in every exterior opening you can find. Mice winter in wiring looms.

## When spring comes

Reverse it: close the bypass, reconnect the water heater, refill, and run every fixture until the water runs clear with no pink tinge. Check under every sink for drips before you head out.

If you would rather not do it, bring the camper to our service bays before the first freeze night — we winterize in October and November every year, and a slot booked in September is a slot you still have.`,
  },
  {
    slug: "rv-tire-date-codes-explained",
    title: "RV Tire Date Codes: Why Your Tires Die Before the Tread Does",
    excerpt:
      "The last four digits of the DOT code tell you the week and year of manufacture. Most RV tires are unsafe at six or seven years old — even with full tread.",
    category: "Maintenance",
    tags: [
      "RV tire date code",
      "when to replace RV tires",
      "tire age",
      "dry rot tires",
      "RV tire safety",
    ],
    author: "Dana Whitfield",
    date: "2026-08-27",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/camper-four-winds.jpg",
    featured: false,
    status: "live",
    body: `A trailer with 8/32 of tread and four-year-old tires is not a safe trailer. That sentence surprises more first-time buyers than anything else we say on the lot, because tire marketing is all about tread depth and almost nothing about age.

Rubber hardens as it ages. The oils that keep it flexible migrate to the surface and evaporate. Tires sitting under a camper in storage take heat cycles and UV without ever rolling enough to flex, and the sidewalls crack — dry rot — long before the tread looks worn.

## How to read the DOT code

Every tire has a DOT number stamped on the sidewall. The full code runs around the shoulder, but the date is always in the **last four digits**:

> 4019 — manufactured in week 40 of 2019.

Two digits for the week (01–52), two for the year. That is it.

One catch: some tires carry the full DOT number only on the *inner* sidewall, the side you cannot see mounted. Crawl under with a phone camera, or break the bead if you are buying — a dealer who will not let you check the date is telling you something.

## How old is too old?

- **Five to seven years** is the industry replacement window for RVs, regardless of tread.
- LoadRange E trailer tires and most RV-specific tires are considered done at six to seven years.
- NHTSA and every major tire maker point to the same number: rubber that is seven years old has lost enough grip and flexibility that wet braking and sidewall strength are compromised.
- The spare counts. A spare that has sat under the rear bumper for a decade will not hold pressure when you need it.

On a used camper, the tires being *newer* than the coach is a good sign — it means somebody was paying attention.

## The five-minute pre-trip check

1. **Read the date codes** on all four, plus the spare.
2. **Look for cracking** in the sidewall and between the tread blocks. Fingernail-width cracks mean replace now.
3. **Check pressure cold**, not at the gas station after driving. The sticker on the driver's door jamb or the trailer frame is the spec — never the number on the tire sidewall, which is a maximum, not a target.
4. **Feel for flat spots** after storage. Most roll out after a few miles; if they do not, the belt is damaged.
5. **Inspect the valve stems.** Rubber stems crack; metal ones with a cap are what we run on anything over 5,000 lb.

## Age the tires, not the coach

Buyers ask why we put new tires on a five-year-old camper before we sell it. Two reasons: a $900 set of tires is the cheapest insurance we can put between a customer and a highway blowout, and because Michigan roads do not forgive a blowout on I-96 with a family inside.

If you are shopping used and the tires date back to the build year, factor a replacement set into your budget — and use it as a legitimate point in the price conversation. It is one of the few repairs on a used camper that is a fixed, published cost instead of a judgment call.`,
  },
  {
    slug: "true-cost-of-owning-an-rv",
    title: "What It Actually Costs to Own an RV, Per Year",
    excerpt:
      "Insurance, storage, registration, maintenance and campground fees add up fast — a realistic annual budget for a travel trailer, Class C or Class A, with real numbers.",
    category: "Owning an RV",
    tags: [
      "cost of owning an RV",
      "RV ownership costs",
      "RV budget",
      "campground fees",
      "RV insurance cost",
    ],
    author: "Tony Marchetti",
    date: "2026-08-14",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/life-lawn.jpg",
    featured: true,
    status: "live",
    body: `The sticker price is the part everyone budgets for. It is also, over five years, the smaller part.

We sell a lot of first-time units on this lot, and the ones that come back for trade-in after two seasons almost always share a story: the camper was affordable, and the ownership was a surprise. None of the numbers below will shock you individually. Seeing them in one column is the point.

## The fixed costs, whether you camp or not

**Insurance.** Towed trailers run the cheapest — figure $600 to $1,200 a year for full coverage on a $25,000 unit. Motorhomes climb steeply: a Class C runs $1,200 to $2,500, and a Class A with storage coverage can reach $4,000. Full-timers living in the unit need a different policy again — a homeowners policy will not cover a residence on wheels.

**Storage.** If your driveway will not hold it, this is the bill nobody shops for. Outdoor fenced slots in Michigan start around $30 to $50 a month. Covered runs $80 to $150. Indoor, climate-controlled can hit $400. For a seasonal owner paying six months of covered storage, plan on $500 to $900 a year.

**Registration and tags.** Michigan plates on a travel trailer run $100 to $250 depending on weight; motorhomes register as vehicles and cost more. Budget $150 to $400 a year.

**Depreciation.** The big one, and the reason we push used. A new camper loses 20 to 30 percent the moment it leaves the lot, and keeps sliding for the first five years. A three-year-old unit has already absorbed that hit — someone else paid the depreciation tax on your behalf. This is genuinely the largest line in most RV budgets, and buying used is the only real lever you have on it.

## The costs that track how much you use it

**Maintenance.** The old rule — one percent of the unit's value per year — lands around $500 to $2,000 for most campers. Realistic annual spend: roof seal recaulk ($150–$400), bearing repack and brake service ($200–$400), winterization ($150–$300), propane and battery work ($100–$300), plus a repair reserve. The reserve is the line people skip. Appliances do not care about your schedule — a fridge board or a slide motor will find you.

**Campground fees.** State park basic sites run $20 to $40 a night. Full-hookup private parks run $50 to $80. Resorts with pools and activities run $80 to $150. Weekly and monthly rates soften it substantially — monthly rates in many parks are a third of the nightly math. Thirty nights a year at an average private park is $1,800; living in the unit full-time on monthly rates can land under $1,000.

**Fuel.** Tow vehicles: 8 to 12 mpg pulling a 25-foot trailer is realistic. Class A motorhomes: 6 to 10. Class C: 8 to 14. Camper vans and Class B: 18 to 22. Every long tow is a real number worth knowing before you book a 900-mile trip.

## The arithmetic that matters

A travel trailer used six weekends a year, stored covered, insured, tagged and maintained comes out around $3,500 to $6,000 once depreciation is included. Ten weekends at private parks with fuel for the tow vehicle pushes that toward $8,000.

Is it worth it? That depends entirely on how you use it. What we will say is that the owners who stay happiest are the ones who walked in knowing these numbers — because the camper never surprised them. Ask us for the real figures on any unit on the lot, and we will run them with you before you fall in love with the floorplan.`,
  },
  {
    slug: "first-time-camper-buyer-mistakes",
    title: "First-Time Camper Buyer Mistakes (We See Every One of Them)",
    excerpt:
      "Buying too much rig, skipping the roof inspection, financing without shopping the rate, and four more mistakes that cost first-time buyers real money.",
    category: "Buying Guides",
    tags: [
      "first time RV buyer",
      "RV buying mistakes",
      "buying a used camper",
      "RV financing",
      "beginner RV guide",
    ],
    author: "Marco Reyes",
    date: "2026-07-23",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/camper-airstream.jpg",
    featured: false,
    status: "live",
    body: `We have delivered close to two thousand campers since 2009, and the first-time buyers who come back to trade in tell us the same stories every time. None of these mistakes are stupid. They are all the kind of thing that only becomes obvious after the money is spent.

## 1. Buying for the trip you imagined, not the trips you take

The couple who wanted the bunkhouse for grandkids who visit twice a year. The couple who bought a 35-foot fifth wheel for state parks with 30-foot pads. The floorplan has to match your actual calendar — if you camp six weekends a season at Michigan state parks, a 24-foot travel trailer with a dry weight your half-ton can pull is the better camper, every time.

## 2. Letting the tow vehicle be an afterthought

Check three numbers before you fall for anything: your truck's **payload capacity**, its **max tow rating**, and the trailer's **tongue weight**. Cargo payload includes the people, the gear and the tongue weight pressing down on the hitch. A half-ton rated for 9,600 lb of towing can bottom out on payload with a heavy trailer once two adults and a cooler are loaded.

We will not sell you a unit your vehicle cannot legally and safely pull. Bring your door-jamb sticker when you come.

## 3. Skipping the roof and the water history

Anyone can polish an interior. Water damage hides behind panels. We covered the full inspection sequence in our [used RV inspection checklist](/blog/used-rv-inspection-checklist), but the short version: get on the roof, feel the decking, pull the valances, check for delamination. If the seller says no to a roof walk, the search is over.

## 4. Not knowing the total cost

Storage, insurance, registration, winterization and campground fees are real money — we broke it into actual numbers in [the true cost of owning an RV](/blog/true-cost-of-owning-an-rv). Buyers who only budget the payment find out in year one that the camper costs 30 to 40 percent more than the sticker to keep.

## 5. Financing only where you are buying

The dealer's lender is one option, not the default. Credit unions in Michigan routinely beat dealer rates on RV loans, especially on used units where dealer paper runs higher. Get a pre-approval before you shop — it turns the finance desk into a comparison instead of a negotiation, and it tells you your real budget.

While you are at it: run the payment on a shorter term than you think. Seven-year loans on used campers put owners underwater past the point where they can trade, which is how people end up stuck with a unit they no longer use.

## 6. Skipping the walkthrough on delivery

Delivery day is when the unit gets set up by people who know it, and you are standing there. Run every system on shore power. Run the generator if it has one. Cycle the slides both ways. Light every burner. Flush the toilet. Fill the tank and check under the sinks. Every question you have costs nothing that day and a service call later.

## 7. Buying without reading the report

Our 120-point inspection report goes to every buyer before payment. Read it. Ask about every line marked repaired — and every line marked noted. A used camper with a transparent report is not a risk; a used camper with no report is one.

## The shortcut

Come in with your tow vehicle's payload sticker, your credit union's pre-approval, and an honest count of how many weekends a year you actually camp. Three pieces of information, and you will make a better decision than most people make on their second camper.`,
  },
  {
    slug: "full-time-rv-living-guide",
    title: "Full-Time RV Living: What It Really Takes to Live on the Road",
    excerpt:
      "Monthly budgets run $1,000 to $4,000 depending on how you camp — plus mail, internet, healthcare and the rig size decisions that make or break the first year.",
    category: "RV Life",
    tags: [
      "full-time RV living",
      "living in an RV",
      "RV lifestyle",
      "workamping",
      "RV full-time budget",
    ],
    author: "Tony Marchetti",
    date: "2026-06-30",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/life-camp.jpg",
    featured: true,
    status: "live",
    body: `Every season somebody walks onto the lot ready to buy a rig for full-time living, and we ask the same three questions first: where will you get mail, how will you work, and what is your plan for a month of rain in February?

Full-timing is achievable on a normal budget. It is also a logistics project, and the logistics are what wash people out — not the romance of the road.

## The money, without the daydream

Published cost surveys land in a consistent band: **$1,000 to $4,000 a month**, all in.

- **Boondocking on public land** — the low end. Free or $10 to $20 a night in dispersed areas, no hookups, solar and tanks carry you. Frugal full-timers run $1,000 to $1,600.
- **Monthly rates at private parks** — the middle. Full hookups, laundry, often wifi and a pool. $500 to $1,500 a month plus utilities pushes total spend to $2,000 to $3,000.
- **Resorts, snowbird season and nightly rates** — the top. Booking nightly at $70 to $120 and moving often can reach $4,000.

Inside that: campground or lot, fuel, insurance, groceries (unchanged from a house), phone and data, and a repair reserve. The reserve is non-negotiable — a slide motor does not care that you are between paychecks.

## The three decisions that decide your first year

**1. Rig size, honestly.** Full-timers overwhelmingly recommend *smaller* than their first instinct. Tight squeezes, mountain passes and state park pads all get harder with length. Bigger also means more to heat, cool and park. The second most common regret we hear is buying the big fifth wheel; the first is buying one too small for two people's stuff.

**2. Connectivity.** If you work remotely, this is infrastructure, not a perk. Cellular with a real hotspot plan is the baseline; satellite internet has made remote work viable in places it was not three years ago. Budget $80 to $200 a month and test your provider in the areas you plan to sit for weeks at a time.

**3. Mail and domicile.** You need a permanent address for registration, insurance, voting and taxes. A mail service in a state like Texas, Florida or South Dakota handles forwarding; your domicile state decides income tax. This is worth doing with a CPA once, rather than improvising at every border.

## Healthcare, work and the boring parts

Employer coverage that travels with you is the easy path. Otherwise, marketplace plans are state-specific, which ties back to the domicile decision. Seasonal **workamping** — campground hosting, labor rallies, Amazon peak season — trades hours for a site, which can erase the single biggest monthly cost.

Vehicle registration, driver's license renewal and mail forwarding all run off that domicile address. Put all three on one calendar reminder.

## What we tell buyers on this lot

Start with a used unit. The depreciation you avoid by buying three years old is a year or more of living expenses, and the first year of full-timing is when you learn what you actually need. Check every appliance runs under load, insist on the roof and water report, and make sure the tires date within the last five years before you commit to a 12,000-mile year.

Then go. The owners who make it past year two are the ones who stopped researching and started adjusting — because month four on the road teaches you more than four years of forums.`,
  },
  {
    slug: "towing-a-travel-trailer-basics",
    title: "Towing a Travel Trailer: The Basics Nobody Explains at Delivery",
    excerpt:
      "Tongue weight, payload, weight-distribution hitches and backing up — the towing fundamentals that turn a stressful first drive into an ordinary one.",
    category: "RV Life",
    tags: [
      "towing a travel trailer",
      "RV towing guide",
      "tongue weight",
      "weight distribution hitch",
      "first time towing",
    ],
    author: "Marco Reyes",
    date: "2026-06-11",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/camper-cherokee.jpg",
    featured: false,
    status: "live",
    body: `The first time you back a travel trailer into a campsite, you will over-correct, swing wide, and get out four times to look. Everyone does. The skills that matter most for safety are different from the skills that look impressive in the parking lot, and they are all learnable in an afternoon.

## Know your three numbers

Before anything moves, understand the arithmetic that keeps it legal and controllable:

- **GVWR of the trailer** — its maximum loaded weight, not its empty weight. The number on the scale at a rest stop, not the brochure.
- **Tongue weight** — 10 to 15 percent of the loaded trailer weight pressing down on the hitch. A 5,000 lb trailer wants 500 to 750 lb of tongue weight. Too little and the trailer fishtails; too much and you unload the tow vehicle's rear axle.
- **Payload capacity** — from the driver's door jamb sticker. It must cover people, gear, *and* the tongue weight. This is the number that catches people out, because it is smaller than the tow rating printed on the tailgate.

If you are close to any of these limits, we will say so before the sale. It is not a sales technique — we deliver the unit and we want it arriving the same way it left.

## The hitch setup

Two-pound trailers with a straight coupler can tow on a simple ball mount. Anything with real weight behind it wants a **weight-distribution hitch** with sway control: spring bars preload the tow vehicle's rear axle, which keeps the headlights level and the steering light, and the friction in the bars dampens crosswind sway.

Torque the bars properly, keep the hitch greased, and check the pin and clip every stop. The hitch is the single failure point that separates a bad day from a catastrophic one.

## Driving it

- **Leave space.** Double your following distance. Braking with 5,000 lb behind you is a different physics problem.
- **Sway happens fast.** The first sign is the trailer starting a slow weave. Ease off the gas — do not brake, and do not steer into it. Speed is what puts sway into a jackknife.
- **Pass trucks with intent.** Complete the pass decisively; the air gap between a semi and your sidewall is real.
- **Fuel stops take planning.** Approach angles matter more than pump availability. Pull through or set up to leave forward.
- **Tire pressure is not optional.** Check it cold every morning of a trip, trailer and tow vehicle both. See [our tire date code guide](/blog/rv-tire-date-codes-explained) for the age side of the same story.

## Backing up

The counterintuitive rule: **put your hand on the bottom of the steering wheel and steer the direction you want the trailer's rear to go.** Mirror image, every time.

With a spotter outside and the windows down, move at walking speed. If the trailer starts to jackknife, pull forward until it straightens and start the turn again — never try to unwind a tight angle in reverse. Practice in an empty lot before the campsite. Nobody can tell from the driver's seat which direction the trailer went until they look.

## The pre-trip walk

Coupler latched, pin in, chains crossed under the tongue, electrical plug connected, lights and brakes tested with a helper, tire pressures checked, propane tanks secured, slides and awnings in, entry door locked, mirrors adjusted.

It takes five minutes. It is the five minutes that keeps the rest of the trip a vacation.`,
  },
  {
    slug: "best-michigan-campgrounds-from-detroit",
    title: "Best Michigan Campgrounds Within a Few Hours of Detroit",
    excerpt:
      "From Camp Dearborn 35 minutes out to Sleeping Bear Dunes and Pictured Rocks up north — a Detroit-local list of campgrounds worth towing to.",
    category: "Destinations",
    tags: [
      "Michigan campgrounds",
      "campgrounds near Detroit",
      "RV camping Michigan",
      "Sleeping Bear Dunes camping",
      "Pictured Rocks camping",
    ],
    author: "Marco Reyes",
    date: "2026-05-29",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/hero-road.jpg",
    featured: false,
    status: "live",
    body: `Living on Michigan Ave gives us a good view of where people actually go. These are the runs our customers tow most — sorted by how far you are willing to drive on a Friday after work.

## Thirty minutes out: the weekend you still have time for

**Camp Dearborn** sits on 626 acres in Milford with six lakes, and it is about 35 minutes from downtown Detroit. Full hookups, a beach, and enough programming that kids do not ask what there is to do. It books out for holiday weekends — the local crowd knows about it.

**Island Lake Recreation Area** in Brighton is a state recreation area with a campground loop, a swimming beach and miles of paved trail. Basic sites, no hookups, and a location that makes a one-night turnaround easy.

**Pontiac Lake Recreation Area** north of Pontiac is the same idea: state-park simple, close enough that you can leave after work and still eat dinner at your own table.

## On the water

**Sterling State Park** in Monroe is the closest Michigan state park to Detroit and the only one on Lake Erie's shore. marsh trails, a beach, and a launch if you are towing a boat behind the camper.

**Warren Dunes** near Sawyer is worth the two hours for one thing: 240-foot dunes over Lake Michigan. Climb them at sunset. Sites are inland of the beach, so bring the wagon.

**Muskegon** and the state parks along that shore give you the Lake Michigan beach towns without the Traverse City drive — good for a three-day trip.

## The northern runs: plan a week

**Traverse City** country — including the state parks around the bay — is the drive most of our July customers make. Book early; the good loops go months ahead.

**Sleeping Bear Dunes National Lakeshore** is a national park in everything but name. The dune climb, the Pierce Stocking scenic drive and the quiet of the Leelanau Peninsula justify the five-hour tow. Campgrounds in the area fill by spring.

**Pictured Rocks** near Munising is the far end of a Michigan trip — sandstone cliffs, sea caves and the inland lakes. Seven hours from Detroit, and the sort of run where a self-contained camper beats a motel by a mile.

## Year-round and shoulder season

**Fort Custer** near Kalamazoo holds late into the fall and opens early, which makes it the pick for a May or October weekend when the northern parks are still closed. **Holland** state park gives you the tulip time crowds and the lake shore in one.

## Before you tow

Check the pad length against your rig, confirm the hookup amperage (a 30-amp pedestal will not run two air conditioners), and know your gray and black tank capacity for longer stays without hookups. If you are unsure whether your trailer fits a loop, call the park — they measure, and they will tell you no more honestly than a booking site will.

Pick the campground first, then the route. It is a better way to plan than the other way around — and if you do not have the camper yet, come see what is on the lot. Two hours of highway is an easy first trip in the right unit.`,
  },
  {
    slug: "how-we-price-trade-ins",
    title: "How We Price a Trade-In (And Why the Number Moves)",
    excerpt:
      "Clean wholesale value, condition adjustments, demand and payoff — the four inputs behind every trade number we write, plus what raises yours.",
    category: "Dealership",
    tags: [
      "RV trade-in value",
      "sell my RV",
      "trade in camper",
      "NADA RV value",
      "sell my RV Michigan",
    ],
    author: "Tony Marchetti",
    date: "2026-09-04",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/life-lot.jpg",
    featured: false,
    status: "live",
    body: `People ask why two campers of the same year and model can trade in thousands apart. The answer is boring and consistent once you see the inputs, and knowing them is how you get to the high end of the range.

## Input one: the book value, used properly

Every appraisal starts with the wholesale guide — the number a dealer would reasonably expect at auction. Two things get confused here: **retail value**, which is what a camper sells for on a lot with a warranty and a reconditioned roof behind it, and **wholesale**, which is what it is worth to a dealer taking the risk on the unit. Your trade is measured against wholesale, then adjusted. The gap between the two is not markup for its own sake — it is the reconditioning, the lot time, the inspection labor and the guarantee we carry after the sale.

## Input two: condition, in the order it hurts

Judged in roughly this order of financial impact:

1. **Water history.** Delamination, soft flooring or a failed roof seal costs the most to fix and scares the most buyers. One documented roof reseal in the last two years is worth real money.
2. **Age of tires and appliances.** Cheap to rectify, but they show up as deductions on every appraisal.
3. **Cosmetics.** Awning fabric, decals, interior wear — visible, priced cheaply, and usually the difference between good and excellent condition grade.
4. **Systems test.** If the fridge, slides, generator and A/C all run clean on our bench, the unit leaves as a retail-ready camper instead of a project.

A clean history folder — reseal receipts, service records, winterization invoices — moves the number more than most owners expect. Paperwork proves the maintenance happened.

## Input three: demand and season

We sell what moves. Travel trailers with floorplans that turn in a week trade strong. A 40-foot diesel pusher in a soft market does not. Timing matters too: campers appraised in early spring, when the lot needs inventory, land higher than units appraised in October when every yard is full.

This is not a trick — it is a market, and markets have seasons. If you are not in a hurry, shop your trade in March.

## Input four: your payoff

If you owe money on the unit, the lien gets paid from the deal and the equity comes to you in cash or down payment. A current payoff statement keeps the number from moving between the appraisal and the closing.

## What raises your number before we meet

- Get the roof resealed and the paperwork for it.
- Replace aged tires, or price them in and say so.
- Run the slide and fridge maintenance before the appointment.
- Detail it yourself — clean units get the benefit of the doubt on condition grade.
- Bring every record you have.

## The process on our end

We appraise in writing within one business day. You can take that number and sell privately — you may well get more, in exchange for showings, strangers and the title paperwork. Or apply it to a unit on the lot, where the trade credit stacks with the purchase in a way a private sale cannot.

Either way you get the same number from us: the wholesale value, the condition adjustments and the market position, written down. If you want to see what yours is worth, [start with the trade page](/sell) or bring the unit by Michigan Ave — a look in person beats a form every time.`,
  },
];

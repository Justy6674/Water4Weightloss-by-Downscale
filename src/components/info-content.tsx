
"use client"

import { Separator } from "@/components/ui/separator"

export function InfoContent() {
  return (
    <div className="space-y-6 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-h2:text-2xl prose-h3:text-xl prose-strong:text-foreground">
      <section>
        <h2>Understanding the Water–Fat Connection</h2>
        <p>
          Water is not just a passive fluid; it actively participates in your body’s metabolic processes. The first step in fat metabolism (hydrolysis) requires water molecules. If you’re not well-hydrated, your body’s ability to burn fat for energy can be compromised.
        </p>
        <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
          <strong>In short:</strong> Adequate hydration is physiologically vital for fat metabolism.
        </blockquote>
        <p>
          Beyond the chemical reaction, water supports the liver and kidneys, which process metabolic waste. Dehydration slows them down, hampering weight loss efforts. Staying well-hydrated keeps these organs efficient, helping metabolize stored fat into energy.
        </p>
      </section>

      <Separator />

      <section>
        <h2>Hydration’s Impact on Weight Loss (Lifestyle Factors)</h2>
        <p>
          Proper hydration also affects behaviors. Thirst is often mistaken for hunger. Drinking water, especially before meals, can curb appetite and reduce calorie intake.
        </p>
        <p>
          Hydration also has a subtle effect on your metabolic rate. Staying hydrated keeps your energy up and metabolism humming. It's also crucial for exercise, as even a small amount of water loss can impair physical performance and muscle function.
        </p>
      </section>

      <Separator />

      <section>
        <h2>Hydration and Weight Loss Medications</h2>
        <p>
          If you are using weight loss medications (like GLP-1 agonists), staying hydrated is even more crucial. These medications can diminish your thirst drive, and side effects like nausea can deplete fluids.
        </p>
        <p>
          Crucially, many side effects of these medications are preventable or eased by hydration. Constipation, dry mouth, headaches, and fatigue can all be symptoms of mild dehydration. Drinking enough water can lessen these symptoms and make your treatment more comfortable.
        </p>
      </section>
      
      <Separator />

      <section>
        <h2>How Much Water Should You Drink?</h2>
        <p>
          A simple guideline is to drink about half your body weight in ounces of water daily. For instance, a 200-pound individual would aim for ~100 ounces per day (about 3 liters). Adjust based on your activity level, climate, and personal needs. Your urine color is a great indicator: aim for pale yellow.
        </p>
      </section>

      <Separator />
      
      <section>
        <h2>Key Takeaways</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Water is essential for fat burn:</strong> It's required for the chemical reaction that breaks down fat.</li>
          <li><strong>Better hydration = better metabolism:</strong> Hydration keeps your cells and organs working efficiently.</li>
          <li><strong>Appetite and energy benefits:</strong> Water can reduce overeating and helps you exercise longer.</li>
          <li><strong>Hydration is critical on weight loss meds:</strong> It helps maximize the medication’s effectiveness and reduce side effects.</li>
          <li><strong>Aim for 2–3+ liters a day:</strong> A general target for most adults, but listen to your body.</li>
        </ul>
      </section>
    </div>
  )
}

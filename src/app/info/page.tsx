
"use client"
import Link from "next/link"
import { ArrowLeft, BookUser } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-body">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">The Science of Hydration for Weight Loss</CardTitle>
            <CardDescription className="text-lg">
              Information provided by Downscale Weight Loss Clinic.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-h2:text-2xl prose-h3:text-xl prose-strong:text-foreground">

            <section>
              <h2>Understanding the Water–Fat Connection</h2>
              <p>
                Water is not just a passive fluid; it actively participates in your body’s metabolic processes. In fact, the first step in fat metabolism (breaking down stored triglycerides) is hydrolysis, a chemical reaction that literally requires water molecules. Enzymes called lipases cleave fat molecules into glycerol and fatty acids, and this lipolysis process depends on H₂O being available. If you’re not well-hydrated, your body’s ability to burn fat for energy can be compromised because it cannot break down fat efficiently without enough water. Research even suggests that mild dehydration reduces the rate of lipolysis, likely due to hormonal and cellular changes. In short, adequate hydration is physiologically vital for fat metabolism, ensuring that stored fat can be converted into fuel rather than staying locked away in adipose tissue.
              </p>
              <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                <strong>Figure:</strong> Hypothesized effects of hydration on fat cells. In normal hydration, fat (triglyceride) is regularly broken down into glycerol and fatty acids for energy. In dehydration, the body tends to store more fat and burns less, possibly due to insulin resistance and altered enzyme function. Maintaining good hydration supports continual fat breakdown.
              </blockquote>
              <p>
                Beyond the chemical reaction of hydrolysis, water supports the organs and reactions that help metabolize fat. Your liver and kidneys play key roles in processing metabolic waste and byproducts of fat breakdown, and they work best when you are hydrated. If you become dehydrated, kidney function declines, and the liver has to work overtime to filter toxins, diverting it from its fat-burning duties. This means dehydration can indirectly cause your body to burn fat more slowly, hampering weight loss efforts. On the flip side, staying well-hydrated keeps these organs efficient, helping metabolize stored fat into energy and clearing out any waste from fat breakdown. Consistently drinking enough water essentially primes your body to use fat as fuel by optimizing metabolic and organ functions.
              </p>
            </section>

            <Separator />

            <section>
              <h2>Hydration’s Impact on Weight Loss (Lifestyle Factors)</h2>
              <p>
                Proper hydration doesn’t just influence fat chemistry—it also affects behaviors and other physiological aspects of weight management. Notably, drinking water can curb appetite in many people. Thirst is often mistaken for hunger by the brain; mild dehydration can trigger hunger-like signals that may lead to unnecessary snacking. By sipping water throughout the day and especially before meals, you can prevent those mixed signals. In fact, studies show that drinking water before a meal can reduce calorie intake – for example, one study found people who drank two glasses of water before eating ate about 22% fewer calories than those who didn’t. Thus, staying hydrated helps with portion control and prevents overeating, supporting your dietary efforts.
              </p>
              <p>
                Hydration also has a subtle yet meaningful effect on your metabolic rate. When you are well-hydrated, cellular chemical reactions (including calorie burning) proceed efficiently. Some research indicates that drinking water can temporarily boost metabolism via thermogenesis – your body expends a few extra calories to heat up cold water to body temperature. This effect is modest (e.g. about a 30% increase in metabolic rate for an hour after ~500 mL of water in one study), but over time, every bit of extra energy expenditure can aid weight loss. More importantly, even mild dehydration tends to slow down your metabolism and energy levels, as the body prioritizes essential functions and may burn calories less efficiently. By contrast, drinking enough water keeps your energy up and metabolism humming, creating better conditions for fat loss.
              </p>
              <p>
                Staying hydrated is also crucial for those incorporating exercise into their weight loss journey. During workouts, you lose water through sweat, and even a 1-2% loss of body water can impair physical performance. Adequate water intake ensures optimal muscle function and endurance, as water carries electrolytes that trigger muscle contractions. If you’re dehydrated, you’ll fatigue faster; muscles may cramp and break down muscle protein more quickly, reducing the effectiveness of your workouts. On the other hand, being adequately hydrated reduces fatigue, helps you work out longer, and improves recovery – all of which means you can burn more calories and preserve lean muscle. Additionally, water helps prevent exercise-related heat exhaustion by aiding sweat and cooling. In summary, hydration amplifies the benefits of diet and exercise by controlling appetite, supporting a healthy metabolism, and improving workout performance.
              </p>
            </section>

            <Separator />

            <section>
              <h2>Hydration and Weight Loss Medications</h2>
              <p>
                If you are using weight loss medications (such as GLP-1 receptor agonists like semaglutide – e.g. Ozempic/Wegovy – or tirzepatide – Mounjaro), staying hydrated becomes even more crucial. These medications are effective at suppressing appetite and slowing gastric emptying, but that very effect can diminish your thirst drive and fluid intake as well. In other words, when you eat less on these meds, you might inadvertently drink less too. Early in treatment, side effects like nausea or vomiting can further deplete fluids. It’s no surprise that dehydration is a commonly reported issue for patients on GLP-1 agonists.
              </p>
              <p>
                Crucially, many side effects of weight loss medications are preventable or eased by hydration. For example, constipation is a frequent complaint with GLP-1 drugs (due to slower gastric emptying), but drinking plenty of water, along with fiber, helps keep your digestion moving and prevents hard stools. Other common symptoms of mild dehydration on these meds include dry mouth, headaches, muscle cramps, dizziness, and fatigue – which can overlap with medication side effects. By drinking enough, you can avoid these dehydration symptoms or lessen them, making your treatment much more comfortable.
              </p>
            </section>
            
            <Separator />

            <section>
              <h2>How Much Water Should You Drink?</h2>
               <p>
                A common recommendation is the “8×8 rule” – eight glasses of 8 ounces each (about 2 liters total) per day – but many experts suggest a bit more, especially if you are losing weight or on certain medications. A simple guideline is to drink about half your body weight in ounces of water. For instance, a 200-pound individual would aim for ~100 ounces per day (about 3 liters). These are starting points – you should adjust based on your activity level, climate, and personal needs. One of the best indicators of hydration is your urine color. Aim for a pale yellow urine, which usually signifies adequate hydration; a dark yellow or amber color is a signal to drink more.
              </p>
            </section>

            <Separator />
            
             <section>
              <h2>Key Takeaways</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Water is essential for fat burn:</strong> The hydrolysis of fat requires water, so dehydration can hinder your body’s ability to metabolize stored fat.</li>
                <li><strong>Better hydration = better metabolism:</strong> When you’re well-hydrated, your cells and organs work efficiently, which can slightly boost your metabolic rate.</li>
                <li><strong>Appetite and energy benefits:</strong> Drinking water can reduce overeating and fight fatigue, helping you exercise longer and with more energy.</li>
                <li><strong>Hydration is critical on weight loss meds:</strong> Many anti-obesity medications can dull your thirst and risk dehydration. Drink water regularly on these meds even if you don’t feel thirsty.</li>
                <li><strong>Aim for 2–3+ liters a day:</strong> A general target is to drink about 2–3 liters of water per day for most adults, adjusting for your specific needs.</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

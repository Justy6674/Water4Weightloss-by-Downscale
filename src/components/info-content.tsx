"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export function InfoContent() {
  return (
    <div className="w-full">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl text-left font-headline hover:no-underline">The Science of Hydration</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-6 pt-2 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-h3:text-xl prose-strong:text-foreground">
                        <section>
                            <h3>Understanding the Water–Fat Connection</h3>
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
                            <h3>Hydration’s Impact on Lifestyle</h3>
                            <p>
                            Proper hydration also affects behaviors. Thirst is often mistaken for hunger. Drinking water, especially before meals, can curb appetite and reduce calorie intake.
                            </p>
                            <p>
                            Hydration also has a subtle effect on your metabolic rate. Staying hydrated keeps your energy up and metabolism humming. It's also crucial for exercise, as even a small amount of water loss can impair physical performance and muscle function.
                            </p>
                        </section>

                        <Separator />
                        
                        <section>
                            <h3>How Much Water Should You Drink?</h3>
                            <p>
                            A simple guideline is to drink about half your body weight in ounces of water daily. For instance, a 200-pound individual would aim for ~100 ounces per day (about 3 liters). Adjust based on your activity level, climate, and personal needs. Your urine color is a great indicator: aim for pale yellow.
                            </p>
                        </section>

                        <Separator />
                        
                        <section>
                            <h3>Key Takeaways</h3>
                            <ul className="list-disc space-y-2 pl-6">
                            <li><strong>Water is essential for fat burn:</strong> It's required for the chemical reaction that breaks down fat.</li>
                            <li><strong>Better hydration = better metabolism:</strong> Hydration keeps your cells and organs working efficiently.</li>
                            <li><strong>Appetite and energy benefits:</strong> Water can reduce overeating and helps you exercise longer.</li>
                            <li><strong>Aim for 2–3+ liters a day:</strong> A general target for most adults, but listen to your body.</li>
                            </ul>
                        </section>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl text-left font-headline hover:no-underline">Endocrine Disrupting Chemicals (EDCs)</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4 pt-2 prose prose-invert prose-p:text-card-foreground/90">
                        <p>This section will provide information on the importance of avoiding plastics and other sources of Endocrine Disrupting Chemicals (EDCs) for hormonal health and weight management.</p>
                        <p className="text-muted-foreground">Content to be added. Please provide the information you would like to include here.</p>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl text-left font-headline hover:no-underline">Understanding BMI &amp; Waist Measurements</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4 pt-2 prose prose-invert prose-p:text-card-foreground/90">
                        <p>This section will provide a kind, patient-first analysis of body metrics like BMI and waist circumference, drawing from best practices to understand them as part of a bigger health picture, not just as numbers on a scale.</p>
                        <p className="text-muted-foreground">Content based on guidance from sources like the World Obesity Federation will be added here.</p>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
                <AccordionTrigger className="text-xl text-left font-headline hover:no-underline">Hydration &amp; Weight Loss Medications</AccordionTrigger>
                <AccordionContent>
                     <div className="space-y-6 pt-2 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-strong:text-foreground">
                        <section>
                           <p>
                            If you are using weight loss medications (like GLP-1 agonists), staying hydrated is even more crucial. These medications can diminish your thirst drive, and side effects like nausea can deplete fluids.
                            </p>
                            <p>
                            Crucially, many side effects of these medications are preventable or eased by hydration. Constipation, dry mouth, headaches, and fatigue can all be symptoms of mild dehydration. Drinking enough water can lessen these symptoms and make your treatment more comfortable.
                            </p>
                             <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                                <strong>Key takeaway:</strong> Hydration helps maximize your medication’s effectiveness and reduces side effects.
                             </blockquote>
                        </section>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  )
}

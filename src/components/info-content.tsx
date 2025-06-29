
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
                    <div className="space-y-6 pt-2 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-h3:text-xl prose-h4:text-lg prose-strong:text-foreground prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2">
                        <section>
                            <h3>What Are EDCs and Why Do They Matter?</h3>
                            <p>
                                Plastics are everywhere in modern life, but many contain chemicals that can interfere with the body's delicate hormonal systems. These are known as <strong>Endocrine-Disrupting Chemicals (EDCs)</strong>. There is a growing fear and scientific consensus that long-term exposure to these chemicals is linked to challenges with weight management and metabolic health.
                            </p>
                            <p>
                                Common examples include <strong>BPA</strong> (used in hard polycarbonate plastics like water bottles and food containers) and <strong>phthalates</strong> (used to make plastics flexible). These chemicals can mimic or block our natural hormones. The emerging concern of <strong>microplastics</strong>—tiny plastic fragments found in our water, food, and even our bodies—is that they can act as vehicles, carrying and leaching these EDCs directly into our tissues.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h3>How Plastic EDCs Can Affect Weight & Metabolism</h3>
                            <p>
                                EDCs are often called "obesogens" because they can disrupt how our bodies manage fat. When they enter the body, they can reprogram the hormonal signals that control energy, appetite, and fat storage. Essentially, they can hijack your body's metabolic controls, creating a "perfect storm" of problems:
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>They can promote the formation and growth of fat cells.</li>
                                <li>They can lead to insulin resistance, making it harder for your body to manage blood sugar.</li>
                                <li>They may reduce the activity of "brown fat," the type of fat that burns calories to produce heat, thus lowering your overall energy expenditure.</li>
                                <li>They can interfere with hormones that regulate appetite, like leptin and ghrelin.</li>
                            </ul>
                            <p>
                                The Endocrine Society notes that these chemicals can predispose a person to gain weight even without eating more calories. The evidence links EDC exposure not just to obesity, but also to metabolic syndrome and a higher risk of developing type 2 diabetes.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h3>Reducing Your Exposure: The Power of Glass and Steel</h3>
                            <p>
                                The great news is that you can significantly reduce your exposure with a few simple, powerful changes. The goal is to minimize contact between your food/water and plastic, especially when it's heated, which can cause chemicals to transfer into your food at a much higher rate.
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Swap Your Water Bottle:</strong> This is the easiest and most impactful first step. Using a <strong>glass or stainless steel</strong> water bottle dramatically cuts down on daily EDC exposure.
                                </li>
                                <li>
                                    <strong>Use Glass for Storage:</strong> Store leftovers in glass containers instead of plastic, especially for hot, fatty, or acidic foods.
                                </li>
                                <li>
                                    <strong>Never Heat Food in Plastic:</strong> Always transfer food to a glass or ceramic dish before microwaving.
                                </li>
                            </ul>
                             <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                                <strong>A Word on "BPA-Free" Plastics:</strong> While it sounds safer, manufacturers often replace BPA with other chemicals (like BPS or BPF) that can have similar hormone-disrupting effects. For this reason, choosing inert materials like glass or stainless steel is always the most reliable and safest choice.
                             </blockquote>
                        </section>

                        <Separator />

                        <section>
                            <h3>Part of Your Holistic Health Plan</h3>
                            <p>
                                Thinking about your environmental exposures is another tool in your wellness toolkit, just like balanced nutrition, regular movement, and consistent hydration. By making these simple swaps, you are helping create a better internal environment for your body to thrive and reach your health goals.
                            </p>
                        </section>

                        <Separator />
                        
                        <section>
                            <h4>Sources & Further Reading</h4>
                            <ol>
                                <li>La Merrill MA, et al. Nature Rev Endocrinol. 2025 – Consensus statement on key characteristics of metabolism-disrupting chemicals.</li>
                                <li>Pérez-Díaz C, et al. Environ Pollut. 2024 – Systematic review of phthalate exposure and metabolic syndrome.</li>
                                <li>Minderoo-Monaco Commission on Plastics and Health. Ann Glob Health. 2023 – Review of plastics’ impacts on human health (EDC content in plastics).</li>
                                <li>Endocrine Society – EDCs and metabolism overview (2019–2023 updates).</li>
                                <li>AAP Clinical Report. Pediatrics. 2018 & AAP Fact Sheet 2024 – Food additives, plastics and child health (recommendations to use glass/stainless).</li>
                                <li>Hong X, et al. Environ Int. 2023 – Experimental study linking BPA, IL-17A and obesity.</li>
                                <li>Ullah S, et al. Front Endocrinol. 2023 – Review of micro- and nano-plastics as endocrine disruptors in mammals.</li>
                                <li>Mayo Clinic Expert Answer (2023) – “What is BPA? Should I be worried?” (practical tips for reducing exposure).</li>
                            </ol>
                        </section>
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

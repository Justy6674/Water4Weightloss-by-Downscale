
"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
                    <div className="space-y-6 pt-2 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-h3:text-xl prose-h4:text-lg prose-strong:text-foreground prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
                        <section>
                            <h3>What Are EDCs and Why Do They Matter?</h3>
                            <p>
                                Plastics are everywhere in modern life, but there is a growing fear and scientific consensus that many contain chemicals that can interfere with the body's delicate hormonal systems. These are known as <strong>Endocrine-Disrupting Chemicals (EDCs)</strong>. Long-term exposure to these chemicals is linked to challenges with weight management and metabolic health.
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
                             <blockquote>
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
                     <div className="space-y-6 pt-2 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-h3:text-xl prose-h4:text-lg prose-strong:text-foreground prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
                        <section>
                            <h3>A Patient-First Approach to Health</h3>
                            <p>
                                It's important to remember that health is a personal journey, and numbers like BMI are just one of many tools to help guide it. They don't define your worth or tell the whole story of your well-being. The information here, based on guidelines from the Obesity Medicine Association, is designed to empower you with knowledge.
                            </p>
                            <blockquote>
                                <strong>The most important principle:</strong> Obesity is a chronic, progressive, and treatable medical condition. It is not a choice or a failure of willpower. It involves complex factors including genetics, environment, and neurobehavioral responses.
                            </blockquote>
                        </section>
                        <Separator />
                        <section>
                            <h3>What Are We Measuring?</h3>
                            <h4>Body Mass Index (BMI)</h4>
                            <p>
                                BMI is a simple screening tool that uses your height and weight to estimate body fat. It's widely used, but it's important to understand its limitations. BMI does not account for muscle mass, bone density, or differences in body composition between genders and ethnicities. It is best used as a starting point for a conversation about health, not as a final verdict. Here are the standard BMI categories used for screening:
                            </p>
                            <ul>
                                <li><strong>18.5 - 24.9:</strong> Generally considered in the normal weight range.</li>
                                <li><strong>25.0 - 29.9:</strong> Classified as overweight.</li>
                                <li><strong>30.0 - 34.9:</strong> Classified as Class I Obesity.</li>
                                <li><strong>35.0 - 39.9:</strong> Classified as Class II Obesity.</li>
                                <li><strong>40.0 and above:</strong> Classified as Class III Obesity.</li>
                            </ul>

                            <h4 className="mt-4">Waist Circumference</h4>
                            <p>
                                Measuring your waist is another helpful tool because it gives an idea of abdominal fat, which is linked to metabolic health. For screening purposes, the following general cut-off points are often used:
                            </p>
                           <ul>
                                <li><strong>For Men:</strong> A waist circumference of 102 cm (40 inches) or more is often considered a risk factor.</li>
                                <li><strong>For Women:</strong> A waist circumference of 88 cm (35 inches) or more is often considered a risk factor.</li>
                            </ul>
                            <p>It's important to note that these thresholds can vary by ethnicity. For example, lower cut-off points are often more appropriate for individuals of Asian descent.</p>
                        </section>
                        <Separator />
                        <section>
                            <h3>Understanding the Health Risks of Obesity</h3>
                            <p>
                                When body fat increases to a point where it affects health, the challenges can be thought of in two main ways:
                            </p>
                            <ul>
                                <li>
                                    <strong>Fat Mass Disease:</strong> This refers to the physical and mechanical stress that excess weight can place on the body. This can lead to issues like osteoarthritis in the knees and hips, sleep apnea, or acid reflux.
                                </li>
                                <li>
                                    <strong>"Sick Fat" Disease (Adiposopathy):</strong> This is when fat tissue itself becomes dysfunctional and releases substances that disrupt the body's normal hormonal and immune balance. This is a primary driver of metabolic conditions like high blood pressure, unhealthy cholesterol levels, and insulin resistance (which leads to type 2 diabetes).
                                </li>
                            </ul>
                        </section>
                         <Separator />
                        <section>
                            <h3>Focusing on the Benefits of Management</h3>
                            <p>
                                Managing obesity is about much more than just the number on the scale; it's about improving your overall health and quality of life. Even a modest weight loss of 5-10% can lead to significant health improvements:
                            </p>
                             <ul>
                                <li>Improved blood sugar, blood pressure, and cholesterol levels.</li>
                                <li>Reduced stress on joints and improved mobility.</li>
                                <li>Better sleep and reduced risk of sleep apnea.</li>
                                <li>Improved mood and overall well-being.</li>
                            </ul>
                            <p className="mt-4">
                                Your health journey is unique. Using tools like hydration tracking, understanding your metrics, and focusing on healthy habits are powerful steps toward a healthier life.
                            </p>
                        </section>
                        <Separator />
                        <section>
                           <h3>Ready to Take the Next Step?</h3>
                           <p>If you are in Australia and would like to discuss a comprehensive, medically-supervised approach to your health, our team at Downscale Weight Loss Clinic is here to help.</p>
                           <Button asChild className="mt-2">
                               <Link href="https://www.downscale.com.au" target="_blank" rel="noopener noreferrer">
                                   Book a Consultation with Downscale Clinic (Australia)
                               </Link>
                           </Button>
                        </section>

                    </div>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
                <AccordionTrigger className="text-xl text-left font-headline hover:no-underline">Hydration &amp; Weight Loss Medications</AccordionTrigger>
                <AccordionContent>
                     <div className="space-y-6 pt-2 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
                        <section>
                           <p>
                            If you are using weight loss medications (like GLP-1 agonists), staying hydrated is even more crucial. These medications can diminish your thirst drive, and side effects like nausea can deplete fluids.
                            </p>
                            <p>
                            Crucially, many side effects of these medications are preventable or eased by hydration. Constipation, dry mouth, headaches, and fatigue can all be symptoms of mild dehydration. Drinking enough water can lessen these symptoms and make your treatment more comfortable.
                            </p>
                             <blockquote>
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

    

    

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
                    <div className="space-y-6 pt-2 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-h3:text-xl prose-strong:text-foreground prose-ul:list-disc prose-ul:pl-6 prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
                        <section>
                            <h3>Understanding the Water–Fat Connection</h3>
                            <p>
                            Water is not just a passive fluid; it actively participates in your body’s metabolic processes. The first step in fat metabolism (hydrolysis) requires water molecules. If you’re not well-hydrated, your body’s ability to burn fat for energy can be compromised.
                            </p>
                            <blockquote>
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
                    <div className="space-y-6 pt-2 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-h3:text-xl prose-h4:text-lg prose-strong:text-foreground prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
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
                            <ul>
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
                            <ul>
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
                            <ul className="list-disc space-y-1 pl-6">
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
                           <ul className="list-disc space-y-1 pl-6">
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
                            <ul className="list-disc space-y-2 pl-6">
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
                             <ul className="list-disc space-y-2 pl-6">
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
                <AccordionTrigger className="text-xl text-left font-headline hover:no-underline">Medications for Weight Loss</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-6 pt-2 prose prose-invert prose-p:text-card-foreground/90 prose-headings:text-foreground prose-h3:text-xl prose-h4:text-lg prose-h5:font-bold prose-strong:text-foreground prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
                        <section>
                            <h4>GLP-1 and Dual-Incretin Agonists</h4>
                            <p>Several large trials show dramatic weight loss with this class of medications, which work by mimicking gut hormones to regulate appetite and blood sugar.</p>

                            <h5>Tirzepatide (Mounjaro / Zepbound)</h5>
                            <p>A dual-agonist that acts on both GIP and GLP-1 receptors.</p>
                            <ul>
                                <li>In the SURMOUNT-1 trial, people without diabetes taking tirzepatide lost between <strong>15% to 20.9%</strong> of their body weight over 72 weeks, compared to just 3.1% with placebo.<sup>[1]</sup></li>
                                <li>In the SURMOUNT-2 trial, people with type 2 diabetes lost between <strong>13% to 15%</strong> of their body weight.<sup>[2]</sup></li>
                                <li>Compared directly to Semaglutide 1mg, Tirzepatide showed greater weight loss in the SURPASS-2 trial (~11.2 kg vs ~5.7 kg).<sup>[3]</sup></li>
                            </ul>

                            <h5>Semaglutide (Ozempic / Wegovy / Rybelsus)</h5>
                            <p>A GLP-1 agonist available as a weekly injection or a daily oral tablet.</p>
                            <ul>
                                <li>In the STEP-1 trial, people without diabetes using the 2.4mg injection lost an average of <strong>14.9%</strong> of their body weight over 68 weeks.<sup>[4]</sup></li>
                                <li>In the STEP-2 trial, people with type 2 diabetes lost around <strong>9.6%</strong> of their body weight.<sup>[5]</sup></li>
                                <li>When compared directly, the 2.4mg injection of Semaglutide led to more weight loss than daily Liraglutide 3.0mg (15.8% vs 6.4%).<sup>[7]</sup></li>
                                <li>Oral semaglutide (Rybelsus) has been shown to produce more modest weight loss (~4.3kg) in studies.<sup>[9]</sup></li>
                            </ul>

                            <h5>Liraglutide (Saxenda)</h5>
                            <p>A daily injectable GLP-1 agonist.</p>
                            <ul>
                                <li>In the SCALE trial, Liraglutide 3.0mg led to an average weight reduction of <strong>8-9%</strong> (~8.4 kg) over 56 weeks.<sup>[10]</sup></li>
                            </ul>
                        </section>

                        <Separator/>

                        <section>
                            <h4>Other Approved Drugs</h4>
                            <h5>Phentermine (± topiramate)</h5>
                            <p>A short-term stimulant that suppresses appetite. Combination therapy with topiramate (Qsymia) can lead to weight loss of <strong>10-12%</strong>. Phentermine alone is FDA-approved only for short-term use (≤12 weeks).<sup>[11, 12]</sup></p>

                            <h5>Metformin</h5>
                            <p>Though not an official weight-loss drug, it often causes modest weight reduction (<strong>~2-3%</strong> of body weight) and is frequently used off-label.<sup>[13]</sup></p>
                            
                            <h5>Others</h5>
                            <p>Naltrexone/bupropion (Contrave) can produce ~5-6% weight loss<sup>[14]</sup>, and Orlistat (Xenical) yields ~3% more weight loss than placebo<sup>[15]</sup>.</p>
                        </section>

                        <Separator/>

                        <section>
                            <h4>New and Emerging Therapies</h4>
                            <p>New drugs show even greater promise. <strong>Retatrutide</strong>, a triple-agonist (GLP-1/GIP/glucagon), has shown early results of up to <strong>24.2%</strong> weight loss in a 48-week trial.<sup>[16]</sup> Other oral options like <strong>Danuglipron</strong> are also in development.<sup>[17]</sup></p>
                        </section>
                        
                        <Separator/>

                        <section>
                            <h4>Efficacy Summary</h4>
                            <ul>
                                <li><strong>Tirzepatide (Mounjaro/Zepbound)</strong>: Up to ~21% weight loss.<sup>[1]</sup></li>
                                <li><strong>Semaglutide (Wegovy)</strong>: ~15% weight loss.<sup>[4]</sup></li>
                                <li><strong>Liraglutide (Saxenda)</strong>: ~8% weight loss.<sup>[10]</sup></li>
                                <li><strong>Phentermine/Topiramate (Qsymia)</strong>: ~10-12% weight loss.<sup>[12]</sup></li>
                                <li><strong>Metformin</strong>: Typically &lt;5% body weight.<sup>[13]</sup></li>
                            </ul>
                            <p>These results greatly exceed older drugs and often shift the average weight loss into double digits compared to the ~2-3% seen with lifestyle changes alone.<sup>[1, 4]</sup></p>
                        </section>

                        <Separator/>
                        
                        <section>
                            <h4>Safety &amp; Contraindications</h4>
                            <p>All medications have side effects and must be prescribed and monitored by a physician.</p>
                            <ul>
                                <li><strong>GLP-1 Agonists (Tirzepatide, Semaglutide, Liraglutide)</strong>: Common side effects are gastrointestinal (nausea, vomiting, diarrhea), which usually lessen over time.<sup>[1, 4, 10]</sup> They are contraindicated in patients with a personal or family history of medullary thyroid carcinoma or MEN2 syndrome.</li>
                                <li><strong>Phentermine</strong>: Can raise heart rate and blood pressure and is contraindicated in those with uncontrolled hypertension, heart disease, or hyperthyroidism.</li>
                                 <li><strong>Metformin</strong>: Generally safe but should be avoided in severe kidney or liver disease.</li>
                               </ul>
                               <p>The safety and efficacy of these drugs depend on proper medical supervision, titration, and combination with lifestyle changes.</p>
                        </section>

                        <Separator/>

                        <section>
                            <h4 className="text-base">References</h4>
                            <ol className="text-xs space-y-2">
                                <li>Jastreboff, A. M., Aronne, L. J., Ahmad, N. N., Wharton, S., Connery, L., Alves, B., ... & SURMOUNT-1 Investigators. (2022). Tirzepatide once weekly for the treatment of obesity. <em>New England Journal of Medicine</em>, <em>387</em>(3), 205-216.</li>
                                <li>Garvey, W. T., Frias, J. P., Jastreboff, A. M., le Roux, C. W., Sattar, N., Aizenberg, D., ... & SURMOUNT-2 Investigators. (2023). Tirzepatide once weekly for the treatment of obesity in people with type 2 diabetes (SURMOUNT-2): a randomised, double-blind, placebo-controlled, phase 3 trial. <em>The Lancet</em>, <em>402</em>(10402), 613-626.</li>
                                <li>Frías, J. P., Davies, M. J., Rosenstock, J., Pérez Manghi, F. C., Fernández Landó, L., Bergman, B. K., ... & SURPASS-2 Investigators. (2021). Tirzepatide versus semaglutide once weekly in patients with type 2 diabetes. <em>New England Journal of Medicine</em>, <em>385</em>(6), 503-515.</li>
                                <li>Wilding, J. P. H., Batterham, R. L., Calanna, S., Davies, M., Van Gaal, L. F., Lingvay, I., ... & STEP 1 Study Group. (2021). Once-weekly semaglutide in adults with overweight or obesity. <em>New England Journal of Medicine</em>, <em>384</em>(11), 989-1002.</li>
                                <li>Davies, M., Færch, L., Jeppesen, O. K., Pakseresht, A., Pedersen, S. D., Perreault, L., ... & STEP 2 Study Group. (2021). Semaglutide 2·4 mg once a week in adults with overweight or obesity, and type 2 diabetes (STEP 2): a randomised, double-blind, double-dummy, placebo-controlled, phase 3 trial. <em>The Lancet</em>, <em>397</em>(10278), 971-984.</li>
                                <li>Rubino, D. M., Greenway, F. L., Kent, C. K., O'Neil, P. M., Rosenstock, J., Sørrig, R., ... & STEP 4 Investigators. (2022). Effect of continued weekly subcutaneous semaglutide vs placebo on weight loss maintenance in adults with overweight or obesity: The STEP 4 randomized clinical trial. <em>JAMA</em>, <em>327</em>(2), 153-164.</li>
                                <li>Rubino, D. M., Costello, H., Klem, C., O'Neil, P. M., Wadden, T. A., & STEP 8 Investigators. (2022). Effect of weekly subcutaneous semaglutide vs daily liraglutide on body weight in adults with overweight or obesity without diabetes: The STEP 8 randomized clinical trial. <em>JAMA</em>, <em>328</em>(18), 1827-1838.</li>
                                <li>Wadden, T. A., Bailey, T. S., Billings, L. K., Davies, M., Frias, J. P., Koroleva, A., ... & STEP 3 Investigators. (2021). Effect of subcutaneous semaglutide vs placebo as an adjunct to intensive behavioral therapy on body weight in adults with overweight or obesity: The STEP 3 randomized clinical trial. <em>JAMA</em>, <em>325</em>(14), 1403-1413.</li>
                                <li>Pratley, R., Amod, A., Hoff, S. T., Kadowaki, T., Lingvay, I., Nauck, M., ... & PIONEER 4 investigators. (2019). Oral semaglutide versus subcutaneous liraglutide and placebo in type 2 diabetes (PIONEER 4): a randomised, double-blind, phase 3a trial. <em>The Lancet</em>, <em>394</em>(10192), 39-50.</li>
                                <li>Pi-Sunyer, X., Astrup, A., Fujioka, K., Greenway, F., Halpern, A., Krempf, M., ... & SCALE Obesity and Prediabetes NN8022-1839 Study Group. (2015). A randomized, controlled trial of 3.0 mg of liraglutide in weight management. <em>New England Journal of Medicine</em>, <em>373</em>(1), 11-22.</li>
                                <li>Jordan, J., Astrup, A., Engeli, S., Narkiewicz, K., Day, W. W., & Finer, N. (2014). Cardiovascular effects of phentermine and topiramate: a new drug combination for the treatment of obesity. <em>Journal of hypertension</em>, <em>32</em>(6), 1178-1188.</li>
                                <li>Allison, D. B., Gadde, K. M., Garvey, W. T., Peterson, C. A., Schwiers, M. L., Najarian, T., ... & Troupin, B. (2012). Controlled-release phentermine/topiramate in severely obese adults: a randomized controlled trial (EQUIP). <em>Obesity</em>, <em>20</em>(2), 330-342.</li>
                                <li>Apolzan, J. W., Venditti, E. M., Edelstein, S. L., Knowler, W. C., Dabelea, D., Boyko, E. J., ... & Diabetes Prevention Program Research Group. (2019). Long-term weight loss with metformin or lifestyle intervention in the diabetes prevention program outcomes study. <em>Annals of internal medicine</em>, <em>170</em>(10), 682-690.</li>
                                <li>Greenway, F. L., Fujioka, K., Plodkowski, R. A., O'Neil, P. M., Guttadauria, M., & The COR-I Study Group. (2010). Effect of naltrexone plus bupropion on weight loss in overweight and obese adults (COR-I): a multicentre, randomised, double-blind, placebo-controlled, phase 3 trial. <em>The Lancet</em>, <em>376</em>(9741), 595-605.</li>
                                <li>Torgerson, J. S., Hauptman, J., Boldrin, M. N., & Sjöström, L. (2004). XENical in the prevention of diabetes in obese subjects (XENDOS) study: a randomized study of orlistat as an adjunct to lifestyle changes for the prevention of type 2 diabetes in obese patients. <em>Diabetes care</em>, <em>27</em>(1), 155-161.</li>
                                <li>Jastreboff, A. M., Kaplan, L. M., Frías, J. P., Wu, Q., Du, Y., Gzoulis, M. G., ... & Retatrutide Phase 2 Investigators. (2023). Triple-hormone-receptor agonist retatrutide for obesity—a phase 2 trial. <em>New England Journal of Medicine</em>, <em>389</em>(6), 514-526.</li>
                                <li>Pfizer. (2023, December 1). <em>Pfizer Provides Update on GLP-1-RA Clinical Development Program for Obesity and Diabetes</em>. [Press Release]. Retrieved from Pfizer's news releases.</li>
                            </ol>
                        </section>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  )
}

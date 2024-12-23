(async function () {
 const CONFIG = {
   URL_PATTERN: "administration-etrangers-en-france",
   TAB_NAME: "Demande d'accès à la Nationalité Française",
   API_ENDPOINT: "https://administration-etrangers-en-france.interieur.gouv.fr/api/anf/dossier-stepper",
   WAIT_TIME: 100
 };

 if (!window.location.href.includes(CONFIG.URL_PATTERN)) return;

 try {
   
   async function waitForElement() {
       while (true) {
           const tabElement = Array.from(document.querySelectorAll('a[role="tab"]'))
               .find(el => el.textContent.trim() === CONFIG.TAB_NAME);
           
           if (tabElement) {
               return tabElement;
           }
           
           await new Promise(resolve => setTimeout(resolve, CONFIG.WAIT_TIME)); // Wait before trying again
       }
   } 
   const tabElement = await waitForElement();
   
   tabElement.click();
   
   const response = await fetch(CONFIG.API_ENDPOINT);
   if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
   
   const data = await response.json();
   if (!data?.dossier?.statut) throw new Error("Statut non trouvé");
   
   const dossierStatus = data.dossier.statut
   .replace(/_/g, " ")
   .toLowerCase()
   .replace(/\b\w/, char => char.toUpperCase());

   function daysAgo(dateString) {
   const inputDate = new Date(dateString);
   const currentDate = new Date();
   const diffInDays = Math.floor((currentDate - inputDate) / (1000 * 60 * 60 * 24));

   if (diffInDays === 0) return "Aujourd'hui";
   if (diffInDays === 1) return "Il y a 1 jour";
   return `Il y a ${diffInDays} jours`;
   }
   
   const activeStep = document.querySelector("li.stepsBox--item.active");
   if (!activeStep) throw new Error("Étape active non trouvée");

   const newElement = document.createElement("li");
   newElement.setAttribute("_ngcontent-exv-c17", "");
   newElement.setAttribute("style", `
   background: linear-gradient(61deg, #97ff97, #9dc1af);
   border: 4px solid #71df79;
   border-radius: 8px;
   box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2), 5px 5px 15px rgba(0, 0, 0, 0.3);
   display: flex;
   align-items: center;
   justify-content: center;
   font-family: Arial, sans-serif;
   font-size: 18px;
   color: #080000;
   `);
   newElement.className = "stepsBox--item active";
   newElement.innerHTML = `
   <div _ngcontent-exv-c17="" class="steps-content">
     <span _ngcontent-exv-c17="" class="stepNum">
     <span _ngcontent-exv-c17="" aria-hidden="true" class="fa fa-hourglass-start" style="color: #bf2626;"></span>
     </span>
     <p _ngcontent-exv-c17="" style="color: #bf2626 !important;">
     ${dossierStatus} (${daysAgo(data?.dossier?.date_statut)})
     </p>
   </div>
   `;

   activeStep.parentNode.insertBefore(newElement, activeStep.nextSibling);
   console.log("Nouvel élément inséré avec le statut du dossier.");
   
 } catch (error) {
   console.error("Erreur:", error.message);
 }
})();
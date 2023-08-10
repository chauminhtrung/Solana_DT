import React from 'react';
import PropTypes from 'prop-types';
import CampaignCard from './CampaignCard';
Datatest.propTypes = {
    
};


const ArrayListImage = [
    {Title:"Hỗ trợ Chiến dịch Doanh nhân Địa phương",Des: "Đẩy mạnh phát triển kinh tế tiểu thương trong cộng đồng",Img:"https://thumbs.dreamstime.com/b/commercial-activities-entrepreneur-opening-store-concept-owning-shop-becoming-owner-retail-property-flat-vector-227516941.jpg"},
  
    {Title:"Xe cứu thương miễn phí chở bệnh nhân nghèo",Des:"Giúp đỡ những cá nhân có hoàn cảnh khó khăn về tài chính được điều trị y tế quan trọng",Img: "https://i.pinimg.com/originals/92/76/53/927653da10520cddaf39691f0787b2f4.jpg"},
  
    {Title:"Chiến dịch tái trồng rừng",Des:"Góp phần bảo tồn môi trường bằng cách trồng cây",Img:"https://giaingo.info/wp-content/uploads/2021/07/4708875_Cover_Rung-768x476.jpg"},
  
    {Title:"Chiến dịch học bổng sinh viên",Des:"Hỗ trợ giáo dục học sinh tài năng và thúc đẩy sự phát triển của các em ở vùng sâu vùng xa",Img: "https://miles2give.org/wp-content/uploads/2019/12/hoc-sinh-vung-cao3.jpg"},
  
    {Title:"Chiến dịch bảo tồn động vật nguy cơ tuyệt chủng",Des:"bảo vệ và cung cấp nơi cứ trú cho động vật sắp tuyệt chủng",Img:"https://www.thiennhien.net/wp-content/uploads/2020/12/211220_tegiac.jpg"},
  
    {Title:"Chiến dịch Đại dương sạch",Des:"Chống ô nhiễm đại dương và bảo vệ sinh vật biển",Img: "https://alphalife.asia/wp-content/uploads/2020/03/o-nhiem-bien-va-dai-duong.jpg"},
  
    {Title:"Chiến dịch nâng cao nhận thức của giới trẻ",Des:"Tầm quan trọng của việc nhận thức của giới trẻ đối với xã hội hiện nay rất quan trọng",Img:"https://3.bp.blogspot.com/-3JGZFksZV-M/VYVKHy1hqFI/AAAAAAAB2gY/7RGamyp1YEQ/s1600/d.jpg"},
  
    {Title:"Sáng kiến ​​Vườn cộng đồng",Des:"Thành lập các khu vườn cộng đồng để thúc đẩy cuộc sống bền vững",Img: "http://www.westviewatlanta.com/wordpress/wp-content/uploads/2014/05/2014-04-26-community-garden-spring-planting-04.jpg"},
  
    {Title:"Hỗ trợ cho người cao tuổi",Des:"Cung cấp hỗ trợ và đồng hành với các thành viên cộng đồng cao tuổi",Img:"https://assets.rappler.com/612F469A6EA84F6BAE882D2B94A4B421/img/8C25B9F8BDF64B9CB6741F91104C9E03/100yearsoldget100thousand.jpg"},
  
    {Title:"Chiến dịch quảng bá văn hóa Việt Nam",Des:"Phát triển truyền thống văn hóa, tuyên truyền lan rộng văn hóa Việt Nam",Img: "https://vietnaminsider.vn/wp-content/uploads/2020/11/cultural-diplomacy.jpg"},
  
    {Title:"Sáng kiến năng lượng sạch",Des:"Thúc đẩy sử dụng các nguồn năng lượng sạch vì một tương lai bền vững",Img:"https://www.amwins.com/images/default-source/insights-images/wind-turbines---energy.jpg?sfvrsn=8a1058d5_1"},
  
    {Title:"Chiến dịch quyên góp cho phòng khám sức khỏe cộng đồng",Des:"Gây quỹ để cung cấp dịch vụ chăm sóc sức khỏe tại các cộng đồng chưa được phục vụ",Img: "https://www.rasmussen.edu/-/media/images/blogs/school-of-health-sciences/2019/what-is-community-health.jpg"},
  
    {Title:"Chiến dịch bảo vệ trẻ em",Des:"Bảo vệ và lên án các hành động ảnh hưởng đến cuộc sống của trẻ em",Img:"https://cdn.cungcap.net/media/img/2019/05/14/bmQqB-1557824104.jpeg"},
  
    {Title:"Chiến dịch giúp đỡ người khuyết tật",Des:"Cung cấp việc làm tạo cuộc sống mới cho những người khuyết tật",Img: "https://hoanhap.vn/uploads/photos/20/4/5f517d1d9bc35.jpg"},
  
    {Title:"Chiến dịch cứu đói giảm nghèo",Des:"Phát triển các chương trình và dự án bền vững nhằm cải thiện điều kiện sống và nâng cao năng lực tự chủ của cộng động",Img:"https://image.sggp.org.vn/w560/Uploaded/2023/ctzdxljwq/2019_02_11/k12e_ELSZ.jpg"},
  
    {Title:"Chiến dịch thây đổi cuộc sống người vô gia cư",Des:"Tạo công việc và nơi ở cho những người vô gia cư",Img: "https://kenh14cdn.com/k:thumb_w/600/Z3WxvDWHkkhwglFfVOnyhzOPBKmr9M/Image/2013/05/blog3/michaelaaronart4-79c57/sang-tao-y-nghia-giup-thay-doi-cuoc-song-cua-nguoi-vo-gia-cu.jpg"},
  ]
  
  

function Datatest(props) {
    return (
        <div>
            <CampaignCard data={ArrayListImage} />
        </div>
    );
}

export default Datatest;